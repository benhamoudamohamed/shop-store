import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Seed } from 'src/shared/seed.class';
import { EntityManager, Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { userLimitDto } from './dto/userLimit.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService extends Seed {

  constructor(
    entityManager: EntityManager,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>) { 
    super(entityManager) 
    //this.fakeIt(Coupon)
  } 

  async findAllByPage(options: IPaginationOptions): Promise<Pagination<Coupon>> {
    const queryBuilder = this.couponRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.created', 'DESC')
    return paginate<Coupon>(queryBuilder, options);
  }  
  
  async findAll(): Promise<Coupon[]> {
    return await this.couponRepository.find();
  }  

  async findOne(id: string): Promise<Coupon>  {
    const coupon = await this.couponRepository.findOne({where: {id}});
    if (!coupon) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'coupon not found',}, HttpStatus.FORBIDDEN);
    }
    return coupon;
  }

  async findByCoupon(code: string): Promise<any> {
    const coupon = await this.couponRepository.findOne({where: {code}});
    if(!coupon) {
      throw new UnauthorizedException('Coupon Not Found');
    }
    return coupon;
  }

  async create(data: CreateCouponDto): Promise<Coupon>  {
    const coupon = this.couponRepository.create({...data});  
    try {
      await this.couponRepository.save(coupon);
      return coupon;
    } catch(error) {
      console.log(error)
      throw new InternalServerErrorException(error); 
    }
  }

  async update(id: string, data: CreateCouponDto): Promise<Coupon>  {
    let coupon = await this.couponRepository.findOne({where: {id}});
    if (!coupon) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'coupon not found',}, HttpStatus.FORBIDDEN);
    }
    try {
      await this.couponRepository.update({ id }, {...data});  
      coupon = await this.couponRepository.findOne({ where: {id}});
      return coupon;
    } catch(error) {
      console.log(error)
      throw new InternalServerErrorException(error); 
    }
  }

  async updateUserLimit(id: string, data: userLimitDto): Promise<Coupon>  {
    let coupon = await this.couponRepository.findOne({where: {id}});
    if (!coupon) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'coupon not found',}, HttpStatus.FORBIDDEN);
    }
    try {
      await this.couponRepository.update({ id }, {...data});  
      coupon = await this.couponRepository.findOne({ where: {id}});
      return coupon;
    } catch(error) {
      console.log(error)
      throw new InternalServerErrorException(error); 
    }
  }

  async delete(id: string): Promise<Coupon> {
    const coupon: any = await this.couponRepository.findOne({ where: {id}});
    if(!coupon) {
      throw new UnauthorizedException('coupon not found');
    }
    await this.couponRepository.delete(id);
    return coupon
  }
}
