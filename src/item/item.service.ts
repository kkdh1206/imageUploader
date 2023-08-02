import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from './item.entity';
import { CreateItemDto } from './DTO/create-item.dto';
import { ItemImage } from './item.Image';
import { ItemCategory, ItemStatus, SortType } from './item-status.enum';
import { User } from 'src/auth/user.entity';
import { Like } from 'typeorm';
import { SearchItemDto } from './DTO/search-item.dto';

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

    // async getItemByTitle(title: string): Promise <Item[]> {
    //     const found = await this.itemRepository.find({where:{title: Like(`${title}`)}}); 

    //     if(!found) {
    //         throw new NotFoundException(`Can't find Item with id ${title}`);
    //     }
    //     return found;
    // }

    async updateItem(id:number, createItemDto:CreateItemDto, images: Array<string>):Promise<Item>{
        const item = await this.getItemById(id);
        const {title, description,  price} = createItemDto;
        item.title = title,
        item.description = description,
        // item.category = category,
        item.price = price,
        // item.status = status,
        item.ImageUrls = images,
            
        await this.itemRepository.save(item); // 데이터베이스에 저장하는 save메소드사용 -- 이게 entity 에 이름 맞는곳에 알아서 저장해주는듯
        return item; // service로 갈값
        }
        
        
        
    

    async patchItemStatus(id:number, status:ItemStatus){
        const item = await this.getItemById(id);
        item.status = status;
        await this.itemRepository.save(item);

        return item
    }

    async getSearchedItem(searchItemDto:SearchItemDto): Promise<Item[]>{
        const { title,  sort } = searchItemDto;
        // let sortObj;
        
        
        // const items = await this.itemRepository.find({
        //     where: {title : Like(`${title}`)}
        // })
        
        
        // if (!sort) {
        //     sortBy가 비어있으면 분류를 안함
        //   } else {
        //     switch (sort) {
        //       case SortType.PRICEDESCEND:
        //         sortObj = { price: 'DESC' };
        //         break;
        //       case SortType.PRICEASCEND:
        //         sortObj = { price: 'ASC' };
        //         break;
        //         case SortType.DATEDESCEND:
        //         sortObj = { createdAt: 'DESC' };
        //         break;
        //       case SortType.DATEASCEND:
        //         sortObj = { createdAt: 'ASC' };
        //         break;
        //     }
        //   }
          
          return this.itemRepository.searchItem(title,sort);
        }
        
        // const total = await this.itemRepository.count(); // 총 상품 몇개인지 알려주는데 사용하면 좋을듯
        
        
    


    async getItemById(id: number): Promise <Item> {
        const found = await this.itemRepository.findOneBy({id}); 

        if(!found) {
            throw new NotFoundException(`Can't find Item with id ${id}`);
        }
        return found;
    }

    async getMyItems ( user: User ): Promise<Item[]>{ // 본인의 item만 가져오는 함수
        const query = this.itemRepository.createQueryBuilder('item'); // query builder 생성 item table에 접근할것이라 'item'를 넣음
        
        query.where('item.userId = :userId',{ userId: user.id }); // item가 가지고 있는 user id 와 컨트롤러에서 매개변수로 넣어준 현재의 user id 와 동일한놈만 골라줌
                                // userId 컬럼에서 찾는거임 !!

        const items = await query.getMany(); // getMany는 위에서 나온 데이터를 전부다 가져올때 사용
        return items; // Query Builder를 사용 -- repository api 메소드로 대부분 대체 가능하지만 복잡한건 query builder 사용해야한다
    }



    async getItemByCategory (category: ItemCategory): Promise<Item[]> { // 카테고리 별로 찾는것
        const item = await this.itemRepository.find({where:{status: ItemStatus.TRADING|| ItemStatus.FASTSELL}&&{category: category}}); // 팔려나간건 안보여줌
        // const item = await this.itemRepository.findBy({category}); // where 은 어디서 찾는지인듯 여기서는 : FindoptionsWhere<Item> 즉, entity에서 찾는다
        // findOneby로 하면 하나만 찾아와서 안된다
        // const found = await this.itemRepository.findOneBy({category});
        // console.log(found);
        if (item == null) {
            throw new NotFoundException(`Can't find Item with category ${category}`);
        }
        return item;
     }


    //  async getItemByStatus (category: ItemCategory,status: ItemStatus): Promise<Item[]> { // status 찾는것
    //     const itemstatus = await this.itemRepository.findBy({status}); 
    //     console.log(itemstatus);
    //     const categoryFound = await this.itemRepository.findOneBy({category});
    //     console.log(categoryFound);
    //     if (!categoryFound) {
    //         throw new NotFoundException(`Can't find Item with category ${category}`);
    //     }
        
    //     const found = await this.itemRepository.findOneBy({status});
    //     if (!found) {
    //         throw new NotFoundException(`Can't find Item with status ${status}`);
    //     }
    //     return itemstatus;
    //  }

     async deleteItem(id:number) : Promise<void> {
        const result = await this.itemRepository.delete({id});
     }
   
}
