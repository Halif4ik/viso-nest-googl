import {ApiProperty} from '@nestjs/swagger';
import {IsUrl, IsOptional, IsString, isURL, Length, IsNumber, Min, IsEmail, Matches} from 'class-validator';
import {Transform} from "class-transformer";

export class CreateNotifscationDto {
    @IsEmail()
    @ApiProperty({example: "temp1@gmail.com", description: 'Email example'})
    readonly user_email: string;

}
