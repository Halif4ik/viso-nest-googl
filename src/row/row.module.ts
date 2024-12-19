import { Module } from '@nestjs/common';
import { RowService } from './row.service';
import { RowController } from './row.controller';
import {PrismaService} from "../prisma.service";
import {NotificationsGateway} from "./notifications.gateway";
import {ConfigModule} from "@nestjs/config";
import {NotifscationModule} from "../notifscation/notifscation.module";

@Module({
  controllers: [RowController],
  providers: [RowService,PrismaService, NotificationsGateway],
  imports:[
    ConfigModule,
    NotifscationModule
  ],
  //exports: [RowService]
})
export class RowModule {}
