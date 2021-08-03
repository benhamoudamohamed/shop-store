import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import { Seed } from 'src/shared/seed.class';

@Injectable()
export class CategoryService extends Seed {

  constructor(
    entityManager: EntityManager,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>) { 
      super(entityManager)
      //this.fakeIt(Category)
    }
    
  async findAll(options: IPaginationOptions): Promise<Pagination<Category>> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.created', 'DESC')
    return paginate<Category>(queryBuilder, options);
  }  
  
  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }   

  async findOne(id: string): Promise<Category>  {
    const category = await this.categoryRepository.findOne({where: {id}});
    if (!category) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Category not found',
      }, HttpStatus.FORBIDDEN);
    }
    return category;
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({...data}); 
    try {
      await this.categoryRepository.save(category);
      return category;
    } catch(error) {
      if (error.code === '23502') {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Null value in some column: ' + error.detail,
        }, HttpStatus.FORBIDDEN);
      } 
      if(error.code === '23505' || error.response.statusCode === 409) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Category name already exist',
        }, HttpStatus.FORBIDDEN);
      }
      else { 
        console.log(error)
        throw new InternalServerErrorException(error); 
      } 
    } 
  }

  async update(id: string, data: CreateCategoryDto): Promise<Category>  {
    let category = await this.categoryRepository.findOne({where: {id}});

    if (!category) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Category not found',
      }, HttpStatus.FORBIDDEN);
    }

    try {
      await this.categoryRepository.update({ id }, {...data});  
      category = await this.categoryRepository.findOne({ where: {id}});
      return category;

    } catch(error) {
      if (error.code === '23502') {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Null value in some column: ' + error.detail,
        }, HttpStatus.FORBIDDEN);
      }
      else {
        console.log(error)
        throw new InternalServerErrorException(error); 
      }
    }
  }

  async delete(id: string): Promise<Category> {
    const category: any = await this.categoryRepository.findOne({ where: {id}});
    if(!category) {
      throw new UnauthorizedException('category not found');
    }
    await this.categoryRepository.delete(id);
    return category
  }
}
