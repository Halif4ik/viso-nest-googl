import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotifscationService } from './notifscation.service';
import { CreateNotifscationDto } from './dto/create-notifscation.dto';

@Controller('notifscation')
export class NotifscationController {
  constructor(private readonly notifscationService: NotifscationService) {}

  @Post()
  async create(@Body() createNotifscationDto: CreateNotifscationDto) {
    return this.notifscationService.createEmailNotific(createNotifscationDto);
  }

}
