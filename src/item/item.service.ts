import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from './item.entity';
import { CreateItemDto } from './DTO/create-item.dto';
import { ItemImage } from './item.Image';
import { ItemCategory, ItemStatus } from './item-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ItemsService {
    constructor(
        private itemRepository: ItemRepository,
     ) {}

     async getAllItems (): Promise<Item[]> {
        return this.itemRepository.find();
     }

    createItem(createItemDto: CreateItemDto, images: Array<string>): Promise<Item>{
        return this.itemRepository.createItem(createItemDto,images)
    }

    async getItemByTitle(title: string): Promise <Item[]> {
        const found = await this.itemRepository.find({where: {title :title}}); 

        if(!found) {
            throw new NotFoundException(`Can't find Item with id ${title}`);
        }
        return found;
    }

    async getMyItems ( user: User ): Promise<Item[]>{ // 본인의 item만 가져오는 함수
        const query = this.itemRepository.createQueryBuilder('item'); // query builder 생성 item table에 접근할것이라 'item'를 넣음
        
        query.where('item.userId = :userId',{ userId: user.id }); // item가 가지고 있는 user id 와 컨트롤러에서 매개변수로 넣어준 현재의 user id 와 동일한놈만 골라줌

        const items = await query.getMany(); // getMany는 위에서 나온 데이터를 전부다 가져올때 사용
        return items; // Query Builder를 사용 -- repository api 메소드로 대부분 대체 가능하지만 복잡한건 query builder 사용해야한다
    }



    async getItemByCategory (category: ItemCategory): Promise<Item[]> { // 카테고리 별로 찾는것
        const item = await this.itemRepository.findBy({category}); // where 은 어디서 찾는지인듯 여기서는 : FindoptionsWhere<Item> 즉, entity에서 찾는다
        // findOneby로 하면 하나만 찾아와서 안된다
        // const found = await this.itemRepository.findOneBy({category});
        // console.log(found);
        if (item == null) {
            throw new NotFoundException(`Can't find Item with category ${category}`);
        }
        return item;
     }


     async getItemByStatus (category: ItemCategory,status: ItemStatus): Promise<Item[]> { // status 찾는것
        const itemstatus = await this.itemRepository.findBy({status}); 
        console.log(itemstatus);
        const categoryFound = await this.itemRepository.findOneBy({category});
        console.log(categoryFound);
        if (!categoryFound) {
            throw new NotFoundException(`Can't find Item with category ${category}`);
        }
        
        const found = await this.itemRepository.findOneBy({status});
        if (!found) {
            throw new NotFoundException(`Can't find Item with status ${status}`);
        }
        return itemstatus;
     }

     async deleteItem(id:number) : Promise<void> {
        const result = await this.itemRepository.delete({id});
     }
   
}
