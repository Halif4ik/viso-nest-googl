import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {NotifscationService} from './notifscation.service';
import {CreateNotifscationDto} from './dto/create-notifscation.dto';
import {ApiTags} from "@nestjs/swagger";

@Controller('notifscation')
export class NotifscationController {
    constructor(private readonly notifscationService: NotifscationService) {
    }

    /*temp handle for testing sendgrid*/
    @ApiTags('Testing notification')
    @Post()
    async create(@Body() createNotifscationDto: CreateNotifscationDto) {
        return this.notifscationService.createEmailNotific(10, 9, [
            {
                id: 1,
                ip: "String",
                user_agent: "String",
                email: createNotifscationDto.user_email
            }]);
    }

}
