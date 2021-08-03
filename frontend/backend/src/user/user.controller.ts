import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Req, SetMetadata, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './dto/user.model';
import { UserService } from './user.service';
import { userAuthGuard } from 'src/shared/auth.guard';
import { CurrentUser }  from 'src/shared/user.decorator';
import { User } from './entities/user.entity';
import RequestWithUser from 'src/shared/requestWithUser.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolesGuard } from 'src/shared/rolesGuard';
import { Roles } from 'src/shared/roles.decorator';
import { UserRole } from 'src/shared/role.enum';

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('api/user')
  @UseGuards(userAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/user',
    });
  }
 
  @Get('api/user/:id')
  @UseGuards(userAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('findbyEmail')
  async findbyEmail(@Body() user: User): Promise<User> {
    return await this.userService.findByEmail(user.email);
  }

  @Get('whoami') 
  @UseGuards(userAuthGuard)
  whoami(@CurrentUser() user: User) { 
    return user;
  }

  @Post('register')
  @UseGuards(userAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  register(@Body() data: CreateUserInput) { 
    return this.userService.register(data);
  }

  @Post('login')
  login(@Body() data: UserType): Promise<{token: string}>  {
    return this.userService.login(data);
  }
 
  @Get('refresh')
  @UseGuards(userAuthGuard)
  refresh(@Req() request: RequestWithUser): Promise<{refreshToken: string}> {
    return this.userService.getRefreshToken(request.user.id);
  }
 
  @Put('api/user/:id')
  @UseGuards(userAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() data: CreateUserInput) {
    return this.userService.update(id, data);
  }

  @Post('resetPassowrd')
  async resetPassowrd(@Body() data: UserType) {
    return await this.userService.resetPassowrd(data);
  }

  @Delete('api/user/:id')
  @UseGuards(userAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { 
    return this.userService.delete(id);
  }
}
 