import { IsBoolean, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';

export class CreateProductDto {

    @IsString()
    @Length(6, 8, { message: 'product code should be between 6 to 8 characters' })
    productCode: string;
    
    @IsString()
    @Length(1, 50)
    name: string;
  
    @Min(0, { message: 'Price must be a postive number' })
    @Type(() => Number)
    price: number;

    @IsBoolean()
    @IsNotEmpty()
    isFavorite: boolean;

    @IsBoolean()	
    @IsNotEmpty()
    isAvailable: boolean;

    @IsString()
    fileName: string;

    @IsString()
    fileURL: string; 

    @IsString()
    fileName_low: string;

    @IsString()
    fileURL_low: string; 
  
    category: Category;
}
