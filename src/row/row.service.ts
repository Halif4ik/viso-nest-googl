import {HttpException, HttpStatus, Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {CreateRowDto} from './dto/create-row.dto';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {Customer, Row} from "@prisma/client";
import {NotificationsGateway} from "./notifications.gateway";
import {HttpService} from "@nestjs/axios";
import {PaginationsDto} from "./dto/parination-rows.dto";
import {NotifscationService} from "../notifscation/notifscation.service";
import {google, sheets_v4} from 'googleapis';

@Injectable()
export class RowService implements OnApplicationBootstrap {
   private readonly logger: Logger = new Logger(RowService.name);
   private linesWrittenCount: number;

   constructor(private prisma: PrismaService,
               private readonly configService: ConfigService,
               private readonly httpService: HttpService,
               private notifscationService: NotifscationService,
               private readonly notificationsGateway: NotificationsGateway,
   ) {
      this.linesWrittenCount = 0;
   }

   async create(createRowDto: CreateRowDto, userFromGuard: { ip: string, user_agent: string }): Promise<Row> {
      const beforeUpdateRowCount: number = await this.prisma.row.count();
      const newRowOrUpdated: Row = await this.prisma.row.upsert({
         where: {
            row_sheets_column_sheets: {
               row_sheets: createRowDto.row_sheets,
               column_sheets: createRowDto.column_sheets,
            },
         },
         create: {
            row_sheets: createRowDto.row_sheets,
            column_sheets: createRowDto.column_sheets,
            text: createRowDto.text,
            empty: createRowDto.empty || false,
         },
         update: {
            text: createRowDto.text,
            empty: createRowDto.empty || false,
         },
      });
      /*sent email notification*/
      const afterUpdateRowCount: number = await this.prisma.row.count();
      if (afterUpdateRowCount - beforeUpdateRowCount > 0 && afterUpdateRowCount % 10 === 0) {
         console.log('afterUpdateRowCount%');
         //await this.notifscationService.createEmailNotific();
      }

      /*after update bd with new data send it by WS*/
      const curUser: Customer = await this.createOrFindUser(userFromGuard, createRowDto.user_email);
      if (curUser.user_agent != 'Node bot')
         this.notificationsGateway.sendRowDataToFront(curUser.id, newRowOrUpdated, "new-row");

      /*this.logger.log(`Created/updaed cell ${newRowOrUpdated.id} new- ${newRowOrUpdated.text}`);*/
      return newRowOrUpdated;
   }

   async onApplicationBootstrap(): Promise<void> {
      await this.fillBDFormSheets();
   }

   async getSheetData(): Promise<Array<Array<string>>> {
      const auth = new google.auth.OAuth2(
          this.configService.get<string>('CLIENT_ID'),
          this.configService.get<string>('CLIENT_SECRET'),
          this.configService.get<string>('REDIRECT_URI')
      );

      // Set your refresh token to get an access token
      auth.setCredentials({refresh_token: this.configService.get<string>('REFRESH_TOKEN')});
      const sheets = google.sheets({version: 'v4', auth});
      try {
         const response = await sheets.spreadsheets.values.get({
            spreadsheetId: this.configService.get<string>('GOOGLE_DOC_KEY'),
            range: this.configService.get<string>('GOOGLE_SHEET_RANGE'),
         });
         return response.data.values;
      } catch (error) {
         console.error('Error:', error.message);
      }
   }

   private async fillBDFormSheets() {
      const values = await this.getSheetData();
      // Collect all promises
      const promises: Promise<Row>[] = [];
      const botUser = await this.createOrFindUser(
          {ip: '192.168.1.1', user_agent: 'Node bot'});

      for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
         const row = values[rowIndex];
         for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cellText = row[colIndex];

            if (cellText) {
               const rowNumber: number = rowIndex + 1;
               const columnLetter: string = String.fromCharCode(65 + colIndex); // Convert to A-Z 65 because array start from 0
               promises.push(
                   this.create({
                      row_sheets: rowNumber,
                      column_sheets: columnLetter,
                      text: cellText,
                   }, botUser)
               );
            }
         }
      }
      // Execute all promises in parallel
      try {
         const results = await Promise.all(promises);
         this.logger.log(`Successfully processed ${results.length} rows.`);
      } catch (error) {
         this.logger.error(`Error processing rows: ${error.message}`);
         throw new HttpException('Error processing rows', HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async findAll(paginationRowDto: PaginationsDto, userFromGuard: { ip: string, user_agent: string }): Promise<Row[]> {
      const {page, revert, start = 0, limit} = paginationRowDto;
      const order = revert ? 'desc' : 'asc';
      const lim: number = limit || +this.configService.get<number>('PAGE_PAGINATION');

      const rows: Row[] = await this.prisma.row.findMany({
         skip: page ? (page - 1) * lim : start,
         take: lim,
         orderBy: {
            id: order,
         },
      });
      /*create user which will listen by WS*/
      await this.createOrFindUser(userFromGuard)
      return rows;
   }

   async findOne(id: number): Promise<Row | null> {
      const row: Row | null = await this.prisma.row.findUnique({where: {id}});
      if (!row)
         throw new HttpException('Row не найден', HttpStatus.NOT_FOUND);
      else return row;

   }

   async createOrFindUser(userFromGuard: { ip: string; user_agent: string }, user_email = ''): Promise<Customer> {
      let existingUser: Customer | null

      console.log('user_email-', user_email);
      if (user_email) {
         existingUser = await this.prisma.customer.findFirst({
            where: {
               email: user_email,
            },
         });
         console.log('IF-', existingUser);
      } else {
         console.log('ELSE-');
         existingUser = await this.prisma.customer.findFirst({
            where: {
               AND: [
                  {ip: userFromGuard.ip},
                  {user_agent: userFromGuard.user_agent},
               ],
            },
         });
         console.log('ELSE-', user_email);
      }
      console.log('IF1-', existingUser?.id);
      if (existingUser?.id) return existingUser;

      // If not found, create a new user
      return this.prisma.customer.create({
         data: {
            ip: userFromGuard.ip,
            user_agent: userFromGuard.user_agent,
            ...(user_email && {email: user_email}),
         },
      });
   }


}
