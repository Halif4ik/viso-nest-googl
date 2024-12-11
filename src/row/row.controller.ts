import {Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, HttpCode} from '@nestjs/common';
import {RowService} from './row.service';
import {CreateRowDto} from './dto/create-row.dto';
import {UpdateRowDto} from './dto/update-row.dto';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {RowExistResponseClass, RowResponseClass} from "./dto/responce-row.dto";

@ApiTags('CRUD Row')
@Controller('rows')
export class RowController {
   constructor(private readonly rowService: RowService) {
   }

   //1.All Users can create new account
   //Endpoint: Post /api/v1/rows/create
   @Post('create')
   @HttpCode(200)
   @ApiOkResponse({
      status: 200,
      description: "Row created successfully",
      type: RowResponseClass
   })
   @ApiBadRequestResponse({
      status: 400,
      description: "Row already exist in db",
      type: RowExistResponseClass
   })
   @ApiOperation({summary: 'Created new row in database'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))

   create(@Body() createRowDto: CreateRowDto): Promise<any> {
      return this.rowService.create(createRowDto);
   }

}
