import { Module } from '@nestjs/common';
import { RowService } from './row.service';
import { RowController } from './row.controller';

@Module({
  controllers: [RowController],
  providers: [RowService],
})
export class RowModule {}
