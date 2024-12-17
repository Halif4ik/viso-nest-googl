import { Module } from '@nestjs/common';
import { NotifscationService } from './notifscation.service';
import { NotifscationController } from './notifscation.controller';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [NotifscationController],
  providers: [NotifscationService,PrismaService],
  exports: [NotifscationService]
})
export class NotifscationModule {}
