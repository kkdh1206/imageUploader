import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from './item.entity';
import { CreateItemDto } from './DTO/create-item.dto';
import { ItemImage } from './item.Image';
import { ItemType, ItemStatus } from './item-status.enum';
import { User } from 'src/auth/user.entity';
import { Like } from 'typeorm';
import { SearchItemDto } from './DTO/search-item.dto';
import { UserRepository } from 'src/auth/user.repository';
import { ItemPaginationService } from './pagination.service';
import { enumConvert } from './enum-convert';

@Injectable()
export class ItemsService {
    constructor(
        private itemRepository: ItemRepository,
        private userRepository: UserRepository,
        private itemPaginationService: ItemPaginationService,
        private convert: enumConvert
     ) {}

     async getAllItems (searchItemDto:SearchItemDto, page:number, pageSize:number): Promise<Item[]|boolean> {
        const {title, sort} = searchItemDto;
        const items = await this.itemRepository.find();
        return this.itemRepository.searchItem(items,sort, page, pageSize ) // page랑 pageSize 끌고와주기
        

        // return this.itemPaginationService.getPaginatedItems(page, pageSize, items)  
        
        // --> 나중에 적용할때 getAll 함수처럼 itemRepository 처리해주고 나온 Item[]을 페이지네이션으로 이동!!!!  --> sort 먼저하고 10개씩 잘라줘야함

     }

    //  async getAll (searchItemDto:SearchItemDto): Promise<Item[]> {
    //     const{title, sort}=searchItemDto
    //     const items = await this.itemRepository.find();
    //     return this.itemRepository.searchItem(items,sort);
    //  }

    createItem(createItemDto: CreateItemDto, images: Array<string>, user:User): Promise<Item>{
        return this.itemRepository.createItem(createItemDto,images,user)
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
        
        
        
    

    async patchItemStatus(id:number, status:string){
        const item = await this.getItemById(id);
        var realStatus:ItemStatus = this.convert.statusConvert(status)
        
        item.status = realStatus;
        await this.itemRepository.save(item);

        return item
    }

    async getSearchedItem(searchItemDto:SearchItemDto,page:number,pageSize:number): Promise<Item[]|boolean>{
        const { title,  sort } = searchItemDto;
        const items = await this.itemRepository.find({
            where: {title : Like(`%${title}%`)}
        })
          
          return this.itemRepository.searchItem(items,sort,page,pageSize);
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

    async getOwner(itemId:number):Promise<Item | undefined>{
        const item = await this.itemRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.user', 'user')
        .where('item.id = :itemId', {itemId})
        .getOne();
        return item;
    }



    // async getItemByCategory (category: string): Promise<Item[]> { // 카테고리 별로 찾는것
    //     var realCategory: ItemType;
    //     if(category == 'BOOK'){
    //         realCategory = ItemType.BOOK
    //     }
    //     if(category == 'CLOTHES'){
    //         realCategory = ItemType.CLOTHES
    //     }
    //     if(category == 'REFRIGERATOR'){
    //         realCategory = ItemType.REFRIGERATOR
    //     }
    //     if(category == 'MORNITER'){
    //         realCategory = ItemType.MORNITER
    //     }
    //     if(category == 'ROOM'){
    //         realCategory = ItemType.ROOM
    //     }
    //     if(category == 'ETC'){
    //         realCategory = ItemType.ETC
    //     }

    //     const item = await this.itemRepository.find({where:{status: ItemStatus.TRADING|| ItemStatus.FASTSELL}&&{category: realCategory}}); // 팔려나간건 안보여줌
    //     // const item = await this.itemRepository.findBy({category}); // where 은 어디서 찾는지인듯 여기서는 : FindoptionsWhere<Item> 즉, entity에서 찾는다
    //     // findOneby로 하면 하나만 찾아와서 안된다
    //     // const found = await this.itemRepository.findOneBy({category});
    //     // console.log(found);
    //     if (item == null) {
    //         throw new NotFoundException(`Can't find Item with category ${category}`);
    //     }
    //     return item;
    //  }

    async deleteInterested ( id: number, user:User ):Promise<User> {
        const currentUser = await this.userRepository.findOne({where:{uid: user.uid}})
        currentUser.interestedId = currentUser.interestedId.filter((num) => num !== id)
        await this.userRepository.save(currentUser);
        return currentUser
    }

    async addInterested ( id: number, user:User ):Promise<User> {
        const currentUser = await this.userRepository.findOne({where:{uid: user.uid}})
        currentUser.interestedId.push(id)
        this.userRepository.save(currentUser);
        return currentUser
    }

    async getInterested (user:User):Promise<Array<number>> {
        const currentUser = await this.userRepository.findOne({where:{uid: user.uid}})
        return currentUser.interestedId;
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
