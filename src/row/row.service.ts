import {Injectable, Logger} from '@nestjs/common';
import {CreateRowDto} from './dto/create-row.dto';
import {UpdateRowDto} from './dto/update-row.dto';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {Row} from "@prisma/client";
import {NotificationsGateway} from "./notifications.gateway";

@Injectable()
export class RowService {
   private readonly logger: Logger = new Logger(RowService.name);

   constructor(private prisma: PrismaService,
               private readonly configService: ConfigService,
               private readonly notificationsGateway: NotificationsGateway,) {
   }

   async create(createRowDto: CreateRowDto):Promise<string> {
      const userInDB = await this.prisma.row.create({
         data: {

         }
      })
      return 'This action adds a new row';
   }

}
