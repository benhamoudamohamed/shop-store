import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/shared/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Coupon]),
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
  controllers: [CouponsController],
  providers: [CouponsService, JwtStrategy, UserService],
  exports: [JwtStrategy, PassportModule]
})
export class CouponsModule {}
