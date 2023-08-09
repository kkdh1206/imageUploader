import { IsEnum, IsNotEmpty } from "class-validator";
import { ItemType, ItemStatus } from "../item-status.enum";
import { Column } from "typeorm";

export class CreateItemDto{
    @IsNotEmpty() // 빈칸이면 오류나게함
    title : string;

    @IsNotEmpty()
    description : string;

    @Column() // ? 이건 뭘까
    category: string;

    @IsNotEmpty()
    price : number;

    @Column()
    status : string;

    @Column()
    quality: string;
    
    // @IsNotEmpty() // 기본이미지로라도 둬서 사진 안올라가는 경우 없게하기
    // photo: any;         // 파일을 받아야함
}