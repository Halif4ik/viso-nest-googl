import {ApiProperty} from '@nestjs/swagger';
import {IsUrl, IsOptional, IsString, isURL, Length, IsNumber, Min, IsEmail, Matches} from 'class-validator';
import {Transform} from "class-transformer";

export class CreateRowDto {
   @ApiProperty({example: '1', description: 'Number of row google sheets'})
   @Transform(({value}) => isNaN(parseInt(value)) ? 1 : parseInt(value),)
   @IsNumber({}, {message: 'Face be Number'})
   @Min(1)
   row_sheets: number;

   @Transform(({value}) => {
      if( value.trim() === '') return null;
      return value;
   })
   @ApiProperty({example: 'A', description: 'Name column of google sheets'})
   @IsString({message: 'Name column, should be string'})
   @Matches(/^[A-Z]$/, { message: 'Column name must be a single uppercase letter (A-Z)' })
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

}
