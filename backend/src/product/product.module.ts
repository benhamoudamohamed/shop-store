import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { PassportModule } from '@nestjs/passport';
import { Category } from 'src/category/entities/category.entity';
import { JwtStrategy } from 'src/shared/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
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
  controllers: [ProductController],
  providers: [ProductService, JwtStrategy, UserService],
  exports: [JwtStrategy, PassportModule]
})
export class ProductModule {}
