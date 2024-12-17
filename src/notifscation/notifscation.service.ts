import { Injectable } from '@nestjs/common';
import { CreateNotifscationDto } from './dto/create-notifscation.dto';
import { UpdateNotifscationDto } from './dto/update-notifscation.dto';

@Injectable()
export class NotifscationService {
  async createEmailNotific(createNotifscationDto: CreateNotifscationDto) {
    return 'This action adds a new notifscation';
  }

}
