import { Module } from '@nestjs/common';
import { RowService } from './row.service';
import { RowController } from './row.controller';
import {PrismaService} from "../prisma.service";
import {NotificationsGateway} from "./notifications.gateway";

@Module({
  controllers: [RowController],
  providers: [RowService,PrismaService, NotificationsGateway],
  exports: [RowService]
})
export class RowModule {}
