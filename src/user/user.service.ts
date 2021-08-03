import { Injectable, HttpException, HttpStatus, InternalServerErrorException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { JwtPayload } from 'src/shared/jwt-payload';
import { UserType } from './dto/user.model';
import { sendEmail } from 'src/shared/sendEmail';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Seed } from 'src/shared/seed.class';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService extends Seed {

  private logger = new Logger('UserController')

  constructor(
    entityManager: EntityManager,
    @InjectRepository(User)
    private userRepository: Repository<User>, 
    private jwtService: JwtService,
    private configService: ConfigService) { 
      super(entityManager)
      //this.fakeIt(User)
    } 

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.created', 'DESC')
    try {
      return paginate<User>(queryBuilder, options);
    } catch (error) {
      this.logger.error(`findAll user: ${error}`);
    }
  }   

  async findOne(id: string): Promise<any>  {
    const user = await this.userRepository.findOne({where: {id}});
    if(!user) {
      this.logger.error(`user not found with id: ${id}`);
      throw new UnauthorizedException('user not found');
    }
    return user.toResponseObject();
  }

  async read(firstname: string): Promise<User>  {
    const user = await this.userRepository.findOne({where: {firstname}});
    if(!user) {
      this.logger.error(`user not found with firstname: ${firstname}`);
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({where: {email}});
    if(!user) {
      this.logger.error(`findByEmail error: ${user}`);
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user.toResponseObject();
  }

  async register(data: CreateUserInput): Promise<any> {
    const { firstname, lastname, email, password, userRole } = data;
    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.userRole = userRole;

    const subject = 'Invitaion';
    const header = 'Activate Your E-mail Address';
    const title = "You've been invited to join our team";
    const subtitle = "To begin please set your password.";
    const buttonTitle = 'Accept';
    const origin = this.configService.get('ORIGIN');
    const link = 'user/reset/'
    const userId = ''

    try {
      await this.userRepository.save(user);
      const user1 = await this.userRepository.findOne({where: {email}});

      if(!user1) {
        this.logger.error(`user not found with email: ${email}`);
        throw new UnauthorizedException('user not found');
      }

      await sendEmail(subject, user1.email, user1.firstname, header, title, subtitle, origin, link, userId, buttonTitle)
      return user.toResponseObject();
    } catch(error) {
      if(error.code === '23505') {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Email address already exist',
        }, HttpStatus.FORBIDDEN);
      }
      else {
        console.log(error)
        this.logger.error(`register error: ${error}`);
        throw new InternalServerErrorException(error)
      }
    }
  } 

  async update(id: string, data: CreateUserInput): Promise<any> {
    const { firstname, lastname, email, password, userRole } = data;

    let user = await this.userRepository.findOne({ where: {id}});
    if(!user) {
      this.logger.error(`user not found with id: ${id}`);
      throw new UnauthorizedException('user not found'); 
    }

    const user1 = new User();
    user1.firstname = firstname;
    user1.lastname = lastname;
    user1.email = email;
    user1.salt = await bcrypt.genSalt();
    user1.password = await this.hashPassword(password, user1.salt);
    user1.userRole = userRole;

    const subject = 'Profile updated';
    const header = 'Profile updated';
    const title = "You've been updating your profile";
    const subtitle = 'If you believe this is an error, please verify';
    const buttonTitle = 'Login';
    const origin = this.configService.get('ORIGIN');
    const link = 'login'
    const userId = ''
 
    if(user1.userRole === 'Admin') {
      await sendEmail(subject, user1.email, user1.firstname, header, title, subtitle, origin, link, userId, buttonTitle)
    }
  
    await this.userRepository.update({ id }, {...user1});
    user = await this.userRepository.findOne({ where: {id}});
    return user.toResponseObject();
  }
 
  async resetPassowrd(data: UserType): Promise<User> {
    const { email, password } = data;

    let user = await this.userRepository.findOne({ where: {email}});
    if(!user) {
      this.logger.error(`user not found with email: ${email}`);
      throw new UnauthorizedException('user not found');
    }

    const user1 = new User();  
    user1.salt = await bcrypt.genSalt();
    user1.password = await this.hashPassword(password, user1.salt);

    const subject = 'Changed Password';
    const header = 'Changed Password';
    const title = 'Your login password has been changed';
    const subtitle = 'If you believe this is an error, please verfiy';
    const buttonTitle = 'Login';
    const origin = this.configService.get('ORIGIN');
    const link = 'login'
    const userId = ''

    await this.userRepository.update({ email }, {...user1});
    if(user.userRole === 'Admin') {
      await sendEmail(subject, email, user.firstname, header, title, subtitle, origin, link, userId, buttonTitle)
    }
    user = await this.userRepository.findOne({ where: {email}});
    return user;
  }

  async login(data: UserType): Promise<{token: string}> {
    const { email } = data;
    let user = await this.userRepository.findOne({ where: { email } });
    const userPass = await this.validateUserPassword(data)

    if (!user || !userPass) {
      this.logger.error(`Invalid credentials: email: ${data.email}, userPass: ${data.password}`);
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Invalid credentials',  
      }, HttpStatus.FORBIDDEN);  
    }
 
    const payload: JwtPayload = { id: user.id, email: user.email, firstname: user.firstname, userRole: user.userRole };
    const token = this.jwtService.sign(payload); 
    this.getRefreshToken(user.id) 
    try {
      return { token };
    } 
    catch(error) {
      this.logger.error(`login error: ${error}`);
    }
  }
 
  async getRefreshToken(id: string): Promise<{refreshToken: string}> {
    let user = await this.userRepository.findOne({ where: {id}});
    if(!user) {
      throw new UnauthorizedException('user not found'); 
    } 

    const payload: JwtPayload = { id: user.id, email: user.email, firstname: user.firstname, userRole: user.userRole };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
    });
 
    const user1 = new User();
    user1.currentHashedRefreshToken = token;
 
    await this.userRepository.update({id: user.id}, {...user1});
    user = await this.userRepository.findOne({ where: {id: user.id}});

    const refreshToken = user.currentHashedRefreshToken;
    try {
      return { refreshToken };
    } 
    catch(error) {
      this.logger.error(`refreshToken error: ${error}`);
    }
  }

  async delete(id: string): Promise<User> {
    const user: any = await this.userRepository.findOne({ where: {id}});
    if(!user) {
      throw new UnauthorizedException('user not found');
    }
    await this.userRepository.delete(id);
    return user.toResponseObject();
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(data: UserType): Promise<string>  {
    const { email, password } = data;
    const user = await this.userRepository.findOne({email});
    if(user && await user.validatePassword(password)) { 
      return user.email;
    } else {
      return null;
    }
  }
}
