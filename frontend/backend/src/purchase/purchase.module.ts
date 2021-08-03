import { Module } from '@nestjs/common';
import { Purchase } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtStrategy } from 'src/shared/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Product, Purchase]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('EXPIRES_IN')
        }
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt'})
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class PurchaseModule {}
