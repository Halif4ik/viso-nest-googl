import { Injectable } from '@nestjs/common';
import { CreateRowDto } from './dto/create-row.dto';
import { UpdateRowDto } from './dto/update-row.dto';

@Injectable()
export class RowService {
  create(createRowDto: CreateRowDto) {
    return 'This action adds a new row';
  }

  findAll() {
    return `This action returns all row`;
  }

  findOne(id: number) {
    return `This action returns a #${id} row`;
  }

  update(id: number, updateRowDto: UpdateRowDto) {
    return `This action updates a #${id} row`;
  }

  remove(id: number) {
    return `This action removes a #${id} row`;
  }
}
