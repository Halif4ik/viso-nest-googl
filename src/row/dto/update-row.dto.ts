import { PartialType } from '@nestjs/swagger';
import { CreateRowDto } from './create-row.dto';

export class UpdateRowDto extends PartialType(CreateRowDto) {}
