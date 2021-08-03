import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ProductDTO {

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @Min(0, { message: 'Price must be a postive number' })
    @Type(() => Number)
    price: number;

    @IsNotEmpty()
    @Min(0, { message: 'quantity must be a postive number' })
    @Type(() => Number)
    quantity: number;

    @IsNotEmpty()
    @Min(0, { message: 'cost must be a postive number' })
    @Type(() => Number)
    cost: number;
} 
 