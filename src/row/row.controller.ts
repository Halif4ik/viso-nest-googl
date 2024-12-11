import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   ValidationPipe,
   UsePipes,
   HttpCode,
   Query
} from '@nestjs/common';
import {RowService} from './row.service';
import {CreateRowDto} from './dto/create-row.dto';
import {UpdateRowDto} from './dto/update-row.dto';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RowExistResponseClass, RowResponseClass} from "./dto/responce-row.dto";
import {Row} from "@prisma/client";
import {PaginationsDto} from "./dto/parination-rows.dto";
import {GeneralResponse} from "./interface/generalResponse.interface";


@ApiTags('CRUD Row')
@Controller('rows')
export class RowController {
   constructor(private readonly rowService: RowService) {
   }

   //1.All Users can create new account
   //Endpoint: Post /rows/create
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

   create(@Body() createRowDto: CreateRowDto): Promise<Row> {
      return this.rowService.create(createRowDto);
   }

   //2.All Users can get rows form BD
   //Endpoint: Get http://localhost:3008/rows?page=1&revert=true&limit=2&start=0
   @Get()
   @ApiOkResponse({
      status: 200,
      description: "Row geted successfully",
      type: RowResponseClass
   })
   @ApiBadRequestResponse({
      status: 400,
      description: "Somthing wrong",
      type: RowExistResponseClass
   })
   @ApiOperation({summary: 'Get  all Rows from database'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))

   async findAll(@Query() paginationRowDto: PaginationsDto):Promise<Row[]> {
      return this.rowService.findAll(paginationRowDto);
   }



   //3.All Users can get  one row form BD by id
   //Endpoint: Get http://localhost:3008/rows/38
   @Get(':id')
   @ApiOkResponse({
      status: 200,
      description: "Row got successfully",
      type: RowResponseClass
   })
   @ApiBadRequestResponse({
      status: 400,
      description: "Somthing wrong",
      type: RowExistResponseClass
   })
   @ApiOperation({summary: 'Get  all Rows from database'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))

   async findOne(@Param('id') id: number):Promise<Row|null> {
      return this.rowService.findOne(id);
   }

}
