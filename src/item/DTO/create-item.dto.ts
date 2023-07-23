import { IsEnum, IsNotEmpty } from "class-validator";
import { ItemCategory } from "../item-status.enum";

export class CreateItemDto{
    @IsNotEmpty() // 빈칸이면 오류나게함
    title : string;

    @IsNotEmpty()
    description : string;

    @IsEnum(ItemCategory)
    category: ItemCategory;

    @IsNotEmpty()
    price : number;
    
    // @IsNotEmpty() // 기본이미지로라도 둬서 사진 안올라가는 경우 없게하기
    // photo: any;         // 파일을 받아야함
}