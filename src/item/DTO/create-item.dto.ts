import { IsEnum, IsNotEmpty } from "class-validator";
import { ItemType, ItemStatus } from "../item-status.enum";

export class CreateItemDto{
    @IsNotEmpty() // 빈칸이면 오류나게함
    title : string;

    @IsNotEmpty()
    description : string;

    @IsEnum(ItemType) // ? 이건 뭘까
    category: ItemType;

    @IsNotEmpty()
    price : number;

    @IsEnum(ItemStatus)
    status : ItemStatus;
    
    // @IsNotEmpty() // 기본이미지로라도 둬서 사진 안올라가는 경우 없게하기
    // photo: any;         // 파일을 받아야함
}