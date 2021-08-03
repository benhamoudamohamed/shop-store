import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Min } from 'class-validator';
import { ProductDTO } from './products.dto';

export class CreatePurchaseDto {
 
    items: ProductDTO[]

    @IsNotEmpty()
    @Min(0, { message: 'subtotal must be a postive number' })
    @Type(() => Number)
    subtotal: number;

    coupon: string;

    @Min(0, { message: 'discount must be a postive number' })
    @Type(() => Number)
    discount: number;

    @IsNotEmpty()
    @Min(0, { message: 'grandTotal must be a postive number' })
    @Type(() => Number)
    grandTotal: number;

    @IsNotEmpty()
    @IsString()
    clientName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsPhoneNumber('TN', { message: 'Invalid Phone number' })
    @Length(8, 8, { message: 'Phone number must be 8 digit' })
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    created: Date;
}
