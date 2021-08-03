import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Config } from 'config/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { DatabaseConfig } from './../config/database.config';
import { PurchaseModule } from './purchase/purchase.module';
import { FileModule } from './file/file.module';
import { CouponsModule } from './coupons/coupons.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FrontendMiddleware } from './shared/frontend.middleware';
const ENV = process.env.NODE_ENV; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Config],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    PurchaseModule,
    FileModule,
    CouponsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FrontendMiddleware)
      .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL }); 
  }
}
