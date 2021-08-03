import { IsString, Length } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @Length(1, 50)
    name: string;

    @IsString()
    fileName: string;

    @IsString()
    fileURL: string;

    @IsString()
    fileName_low: string;

    @IsString()
    fileURL_low: string; 
  
    created: Date;
}
