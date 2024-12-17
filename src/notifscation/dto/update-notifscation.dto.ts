import { PartialType } from '@nestjs/swagger';
import { CreateNotifscationDto } from './create-notifscation.dto';

export class UpdateNotifscationDto extends PartialType(CreateNotifscationDto) {}
