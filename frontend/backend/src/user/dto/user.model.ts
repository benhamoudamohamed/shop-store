import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class UserType {

    @IsEmail()
    @IsNotEmpty()
    @Length(4, 256)
    email: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        {message: 'Passwords format should be: uppercase, lowercase, number or special character'})
    password: string;
}