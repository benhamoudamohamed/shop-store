import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { userAuthGuard } from 'src/shared/auth.guard';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { userLimitDto } from './dto/userLimit.dto';
import { Coupon } from './entities/coupon.entity';

@Controller('api/coupon')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAllByPage(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Coupon>> {
    limit = limit > 100 ? 100 : limit;
    return this.couponsService.findAllByPage({
      page,
      limit,
      route: 'http://localhost:3000/api/coupon',
    });
  }

  @Get('all')
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Get('findByCoupon/:id')
  findByCoupon(@Param('id') id: string) {
    return this.couponsService.findByCoupon(id);
  }

  @Post()
  @UseGuards(userAuthGuard)
  create(@Body() data: CreateCouponDto) {
    return this.couponsService.create(data);
  }

  @Put(':id')
  @UseGuards(userAuthGuard)
  update(@Param('id') id: string, @Body() data: CreateCouponDto) {
    return this.couponsService.update(id, data);
  }

  @Put(':id/userLimit')
  updateUserLimit(@Param('id') id: string, @Body() data: userLimitDto) {
    return this.couponsService.updateUserLimit(id, data);
  }

  @Delete(':id')
  @UseGuards(userAuthGuard)
  remove(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }
}
