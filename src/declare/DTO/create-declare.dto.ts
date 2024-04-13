import { IsNotEmpty } from "class-validator";

export class CreateDeclareDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    status: string;
}