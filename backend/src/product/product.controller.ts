import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { userAuthGuard } from 'src/shared/auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';

@Controller('api/product')
export class ProductController {
  
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllByPage({
      page,
      limit,
      route: 'http://localhost:3000/api/product',
    });
  }

  @Get('all')
  getAllProducts() {
    return this.productService.findAll(); 
  }

  @Get('isFavorite/:isFavorite')
  findByFavorite(@Param('isFavorite') isFavorite: boolean) {
    return this.productService.findByFavorite(isFavorite);
  }

  @Get('category/:id')
  getProductByCategory(@Param('id') category: string) {
    return this.productService.productByCategory(category); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('category/:catId')
  @UseGuards(userAuthGuard)
  create(@Body() data: CreateProductDto, @Param('catId') catId: string) {
    return this.productService.create(data, catId);
  }

  @Put('/:id/category/:catId')
  @UseGuards(userAuthGuard)
  update(@Param('id') id: string, @Body() data: CreateProductDto, @Param('catId') catId: string) {
    return this.productService.update(id, data, catId);
  }

  @Delete(':id')
  @UseGuards(userAuthGuard)
  remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
