import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Purchase } from './entities/purchase.entity';

@Controller('api/purchase')
export class PurchaseController {

  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Purchase>> {
    limit = limit > 100 ? 100 : limit;
    return this.purchaseService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/purchase',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Post()
  create(@Body() data: CreatePurchaseDto) {
    return this.purchaseService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.delete(id);
  }
}
