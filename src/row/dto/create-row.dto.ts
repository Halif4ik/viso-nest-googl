import {ApiProperty} from '@nestjs/swagger';
import {IsUrl, IsOptional, IsString, isURL, Length, IsNumber, Min, IsEmail, Matches} from 'class-validator';
import {Transform} from "class-transformer";

export class CreateRowDto {
   @ApiProperty({example: '1', description: 'Number of row google sheets'})
   @Transform(({value}) => isNaN(parseInt(value)) ? 1 : parseInt(value),)
   @IsNumber({}, {message: 'Face be Number'})
   @Min(1)
   row_sheets: number;

   @ApiProperty({
      example: 'A',
      description: 'Column name in Google Sheets (uppercase letter A-Z or number 1-33)'
   })
   @Transform(({value}) => {
      // Convert numeric column to string if necessary
      if (Number.isInteger(+value) && +value >= 1 && +value <= 33)
         return String.fromCharCode(64 + +value).trim();
      return value;
   })
   @Matches(/^[A-Z]$/, {
      message: 'Column must be an uppercase letter (A-Z) or a number between 1 and 33',
   })
   readonly column_sheets: string;

   @ApiProperty({example: 'some text', description: 'text in cell'})
   @IsString({message: 'text in cell, should be string'})
   @Length(0, 550, {message: 'Text in cell has got min length 0  and max length 550'})
   readonly text: string;

   @Transform(({value}) => {
      return value.toString() === 'true';
   })
   @ApiProperty({example: true, description: 'empty or no row'})
   @IsOptional()
   readonly empty?: boolean;

   @IsEmail()
   @ApiProperty({example: "temp1@gmail.com", description: 'Email example'})
   @IsOptional()
   readonly user_email?: string;

}
