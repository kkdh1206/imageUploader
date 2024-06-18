import { IsNotEmpty } from "class-validator";

export class CreateGroupDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    price : number;

    @IsNotEmpty()
    oldprice : number;


}