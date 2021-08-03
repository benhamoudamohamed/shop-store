import { Product } from './entities/product.entity';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import { EntityManager, Repository } from 'typeorm';
import { Seed } from 'src/shared/seed.class';

@Injectable()
export class ProductService extends Seed {

  constructor(
    entityManager: EntityManager,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>) { 
    super(entityManager)
    //this.fakeIt(Product)
  }

  async findAllByPage(options: IPaginationOptions): Promise<Pagination<Product>> {
    const queryBuilder = this.productRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.created', 'DESC')
    return paginate<Product>(queryBuilder, options);
  }  
  
  async findAll(): Promise<Product[]>  {
    return await this.productRepository.find();
  }

  async productByCategory(id: string,) {
    const category = await this.categoryRepository.findOne({where: {id}, relations:['products', 'products.category']});
    return category.products;
  }

  async findByFavorite(isFavorite: boolean): Promise<any> {
    return await this.productRepository.find({where: {isFavorite}});
  }

  async findOne(id: string): Promise<Product>  {
    const product = await this.productRepository.findOne({where: {id}, relations: ['category']});
    if (!product) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Product not found',}, HttpStatus.FORBIDDEN);
    }
    return product;
  }

  async create(data: CreateProductDto, catId: string): Promise<Product>  {
    const category = await this.categoryRepository.findOne({where: {id: catId}});
    const product = this.productRepository.create({...data, category});  

    try {
      await this.productRepository.save(product);
      return product;
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
          error: 'Duplicate value ' +  error.detail,
        }, HttpStatus.FORBIDDEN);
      } 
      else {
        console.log(error)
        throw new InternalServerErrorException(error); 
      } 
    }
  }

  async update(id: string, data: CreateProductDto, catId: string): Promise<Product>  {
    const category = await this.categoryRepository.findOne({where: {id: catId}});
    let product = await this.productRepository.findOne({where: {id}});
    if (!product) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Product not found',}, HttpStatus.FORBIDDEN);
    }

    try {
      await this.productRepository.update({ id }, {...data, category});  
      product = await this.productRepository.findOne({ where: {id}});
      return product;
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
          error: 'Duplicate value ' +  error.detail,
        }, HttpStatus.FORBIDDEN);
      } 
      else {
        console.log(error)
        throw new InternalServerErrorException(error); 
      } 
    }
  }

  async delete(id: string): Promise<Product> {
    const product: any = await this.productRepository.findOne({ where: {id}});
    if(!product) {
      throw new UnauthorizedException('product not found');
    }
    await this.productRepository.delete(id);
    return product
  }
}
