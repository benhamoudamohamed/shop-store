import { UserService } from 'src/user/user.service';
import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class userAuthGuard implements CanActivate {

  constructor(private configService: ConfigService, public userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      if (!request.headers.authorization) {
        return false;
      }
      request.user = await this.validateToken(request.headers.authorization);
      return true;
    } 
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    try {
      return jwt.verify(token, this.configService.get('JWT_SECRET'));
    } catch (err) {
      console.log(err) 
      throw new HttpException('error ', HttpStatus.UNAUTHORIZED);
    } 
  }  
}
