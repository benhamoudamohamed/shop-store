import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Purchase } from './entities/purchase.entity';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import { EntityManager, Repository } from 'typeorm';
import { Seed } from 'src/shared/seed.class';

@Injectable()
export class PurchaseService extends Seed {

  constructor(
    entityManager: EntityManager,
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>) { 
    super(entityManager) 
    //this.fakeIt(Purchase)
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Purchase>> {
    const queryBuilder = this.purchaseRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.created', 'DESC')
    return paginate<Purchase>(queryBuilder, options);
  }   

  async findOne(id: string): Promise<Purchase>  {
    const purchase = await this.purchaseRepository.findOne({where: {id}});
    if (!purchase) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Purchase not found',}, HttpStatus.FORBIDDEN);
    }
    return purchase;
  }

  async create(data: CreatePurchaseDto): Promise<Purchase>  {
    const purchase = this.purchaseRepository.create({...data});  

    try {
      await this.purchaseRepository.save(purchase);
      return purchase;
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

  async delete(id: string): Promise<Purchase> {
    let purchase = await this.purchaseRepository.findOne({where: {id}});
    if(!purchase) {
      throw new UnauthorizedException('purchase not found');
    }
    await this.purchaseRepository.delete(id);
    return purchase
  }
}
