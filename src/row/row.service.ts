import {HttpException, HttpStatus, Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {CreateRowDto} from './dto/create-row.dto';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {Row} from "@prisma/client";
import {NotificationsGateway} from "./notifications.gateway";
import {HttpService} from "@nestjs/axios";
import {AxiosResponse} from "axios";
import {PaginationsDto} from "./dto/parination-rows.dto";

@Injectable()
export class RowService implements OnApplicationBootstrap {
   private readonly logger: Logger = new Logger(RowService.name);

   constructor(private prisma: PrismaService,
               private readonly configService: ConfigService,
               private readonly httpService: HttpService,
               private readonly notificationsGateway: NotificationsGateway,) {
   }

   async create(createRowDto: CreateRowDto): Promise<Row> {
      const newRowOrUpdated: Promise<Row> = this.prisma.row.upsert({
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


      /*this.logger.log(`Created/updaed cell ${newRowOrUpdated.id} new- ${newRowOrUpdated.text}`);*/
      return newRowOrUpdated;
   }

   async onApplicationBootstrap(): Promise<void> {
      await this.getFormSheetsRows();
   }

   /* private async getSheetCollaborators(sheetId: string = '1'): Promise<any> {
       sheetId ='1kmnr1g92dK-3eNXykYOh2s_FX9bzcUgRIMW4XKY_Yp8';
       const url: string = `https://www.googleapis.com/drive/v3/files/${sheetId}/permissions?key=${this.configService.get<string>('GOOGLE_API_KEY')}`;

       console.log('url!-', url);

       try {
          const response = await this.httpService
              .get(url, {
                 headers: {
                    Authorization: `Bearer ${this.configService.get<string>('GOOGLE_ACCESS_TOKEN')}`,
                 },
              })
              .toPromise();
          console.log('url!-', url);
          console.log('response!-', response.data.permissions);

          return response.data.permissions; // Contains permission details including emails

       } catch (error) {
          this.logger.error(`Failed to fetch collaborators: ${error.message}`);
          throw new HttpException(
              `Failed to fetch collaborators: ${error.message}`,
              HttpStatus.INTERNAL_SERVER_ERROR
          );
       }
    }*/

   private async getFormSheetsRows() {
      const url: string =
          "https://sheets.googleapis.com/v4/spreadsheets/" +
          this.configService.get<string>('GOOGLE_DOC_KEY') +
          "/values/" + encodeURI(this.configService.get<string>('SHEET_PAGE_1')) +
          this.configService.get<string>('GOOGLE_SHEET_RANGE') + "?key=" +
          this.configService.get<string>('GOOGLE_API_KEY');
      let axiosData: any;

      try {
         const axiosResponses = await this.httpService.get<any>(url).toPromise()
         axiosData = axiosResponses.data;
      } catch (error) {
         console.error('Error loading data:', error[0]);
         throw new HttpException(`Responce from Googlesheets- ${error[0]} and status_code- ${+error[1]}`, HttpStatus.BAD_REQUEST);
      }

      if (axiosData?.data?.values.length === 0)
         throw new HttpException('Not found in one of the links any sneakers', HttpStatus.NOT_FOUND);


      // Collect all promises
      const promises: Promise<Row>[] = [];
      const values = axiosData.values;

      for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
         const row = values[rowIndex];
         for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cellText = row[colIndex];

            if (cellText) {
               const rowNumber = rowIndex + 1; // Convert to 1-based index
               const columnLetter = String.fromCharCode(65 + colIndex); // Convert to A-Z
               promises.push(
                   this.create({
                      row_sheets: rowNumber,
                      column_sheets: columnLetter,
                      text: cellText,
                   })
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
      console.log('!!!userFromGuard-',userFromGuard);

      const rows: Row[] = await this.prisma.row.findMany({
         skip: page ? (page - 1) * lim : start,
         take: lim,
         orderBy: {
            id: order,
         },
      });

      /*this.notificationsGateway.sendRowDataToFront()*/
      return rows;
   }

   async findOne(id: number): Promise<Row | null> {
      const row: Row | null = await this.prisma.row.findUnique({
         where: {
            id,
         }
      });

      if (!row) {
         throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      } else {
         return row;
      }
   }

}
