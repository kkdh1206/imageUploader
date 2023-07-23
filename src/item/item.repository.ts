import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Item } from "./item.entity";
import { CreateItemDto } from "./DTO/create-item.dto";
import { ItemCategory, ItemStatus } from "./item-status.enum";
import { ItemImage } from "./item.Image";


@CustomRepository(Item)
export class ItemRepository extends Repository<Item> {
    async createItem(createItemDto : CreateItemDto, images: Array<string>) : Promise<Item>{
        const{title, description, category, price} = createItemDto;
        const item = this.create({ // 객체생성
           title,
           description,
           status: ItemStatus.TRADING,
           category,
           price,
           ImageUrls: images // 배열로 저장하려지만 entity에서 배열이 저장 안되서
        }) // 사진여러개면 배열로 주소 저장
        
       
        await this.save(item); // 데이터베이스에 저장하는 save메소드사용 -- 이게 entity 에 이름 맞는곳에 알아서 저장해주는듯
        return item; // service로 갈값
}


       
    
}