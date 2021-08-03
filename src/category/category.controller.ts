import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { userAuthGuard } from 'src/shared/auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './entities/category.entity';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Category>> {
    limit = limit > 100 ? 100 : limit;
    return this.categoryService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/category',
    });
  }

  @Get('all')
  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
 
  @Post()
  @UseGuards(userAuthGuard)
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data); 
  }
     
  @Put(':id') 
  @UseGuards(userAuthGuard)
  update(@Param('id') id: string, @Body() data: CreateCategoryDto) {
    return this.categoryService.update(id, data);
  } 
 
  @Delete(':id')
  @UseGuards(userAuthGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
