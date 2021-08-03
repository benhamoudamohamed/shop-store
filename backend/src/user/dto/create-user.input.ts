import { IsEmail, IsString, Length, Matches } from "class-validator";
import { UserRole } from "src/shared/role.enum";

export class CreateUserInput {

    @IsString()
    @Length(4, 50)
    firstname: string;

    @IsString()
    @Length(4, 50)
    lastname: string;
  
    @IsEmail()
    @Length(4, 256)
    email: string;
  
    @IsString()
    @Length(8, 20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        {message: 'Passwords format should be: uppercase, lowercase, number or special character'})
    password: string;

    userRole: UserRole;
  
    created: Date;
}
