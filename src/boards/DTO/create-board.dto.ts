import { IsNotEmpty } from "class-validator";

export class CreateBoardmDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    status: string;
}