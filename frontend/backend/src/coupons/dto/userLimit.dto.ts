import { Type } from "class-transformer";
import { Min } from "class-validator";

export class userLimitDto {

    @Min(0, { message: 'User Limit must be a postive number' })
    @Type(() => Number)
    userLimit: number;
}
