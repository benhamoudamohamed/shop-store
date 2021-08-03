import { Type } from "class-transformer";
import { IsString, Length, Min, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateCouponDto {

    @IsString()
    @Length(6, 8, { message: 'coupon code should be between 6 to 8 characters' })
    code: string;

    @Min(0, { message: 'Price must be a postive number' })
    @Type(() => Number)
    discount: number;

    @Min(0, { message: 'User Limit must be a postive number' })
    @Type(() => Number)
    userLimit: number;

    @IsBoolean()
    @IsNotEmpty()
    expired: boolean;
}
