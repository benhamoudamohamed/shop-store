import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './../product/entities/product.entity';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/shared/jwt.strategy';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Product]),
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
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategy, UserService],
  exports: [JwtStrategy, PassportModule]
})
export class CategoryModule {}
