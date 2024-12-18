import {Module} from '@nestjs/common';
import {NotifscationService} from './notifscation.service';
import {NotifscationController} from './notifscation.controller';
import {PrismaService} from "../prisma.service";
import {ConfigModule} from "@nestjs/config";

@Module({
   controllers: [NotifscationController],
   providers: [NotifscationService, PrismaService],
   imports: [ConfigModule],
   exports: [NotifscationService]
})
export class NotifscationModule {
}
