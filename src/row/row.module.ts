import { Module } from '@nestjs/common';
import { RowService } from './row.service';
import { RowController } from './row.controller';
import {PrismaService} from "../prisma.service";
import {NotificationsGateway} from "./notifications.gateway";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {NotifscationModule} from "../notifscation/notifscation.module";

@Module({
  controllers: [RowController],
  providers: [RowService,PrismaService, NotificationsGateway],
  imports:[
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    NotifscationModule
  ],
  //exports: [RowService]
})
export class RowModule {}
