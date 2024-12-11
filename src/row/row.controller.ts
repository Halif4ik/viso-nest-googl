import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RowService } from './row.service';
import { CreateRowDto } from './dto/create-row.dto';
import { UpdateRowDto } from './dto/update-row.dto';

@Controller('row')
export class RowController {
  constructor(private readonly rowService: RowService) {}

  @Post()
  create(@Body() createRowDto: CreateRowDto) {
    return this.rowService.create(createRowDto);
  }

  @Get()
  findAll() {
    return this.rowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRowDto: UpdateRowDto) {
    return this.rowService.update(+id, updateRowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rowService.remove(+id);
  }
}
