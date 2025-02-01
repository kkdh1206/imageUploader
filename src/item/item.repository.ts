import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Like, Repository } from "typeorm";
import { Item } from "./item.entity";
import { CreateItemDto } from "./DTO/create-item.dto";
import { ItemType, ItemStatus, ItemQuality, SoldItemStatus } from "./item-status.enum";
import { ItemImage } from "./item.Image";
import { ItemPaginationService } from "./pagination.service";
import { enumConvert } from "./enum-convert";


@CustomRepository(Item)
export class ItemRepository extends Repository<Item> {

    private itemPaginationService : ItemPaginationService;
    private convert: enumConvert;
    
    initializeDependencies(){ // constructor 사용 안되서 대체로 변수 초기화 위해 사용한것
        this.itemPaginationService = new ItemPaginationService();
        this.convert = new enumConvert();
    }    
    
    async createItem(createItemDto : CreateItemDto, images: Array<string>, user) : Promise<Item>{
        this.initializeDependencies();
        const{title, description, category, price, status, quality} = createItemDto;
        // console.log('?!?!?!?!?!?!!?!??!?!?!?!!?!?!?!?!?!?!?!?!!?');
        var realCategory: ItemType= this.convert.categoryConvert(category);
        var realStatus: ItemStatus= this.convert.statusConvert(status);
        var realQuality: ItemQuality = this.convert.qualityConvert(quality);
        console.log(realCategory);
        const item = this.create({ // 객체생성
           title,
           description,
           status: realStatus, // status 선택가능하게 저
           category: realCategory,
           price,
           quality: realQuality,
           user: user,
           soldItemType: SoldItemStatus.VISIBLE,
           sold: false,
           view: 0,
           ImageUrls: images // 배열로 저장하려지만 entity에서 배열이 저장 안되서
        }) // 사진여러개면 배열로 주소 저장
        
       
        await this.save(item); // 데이터베이스에 저장하는 save메소드사용 -- 이게 entity 에 이름 맞는곳에 알아서 저장해주는듯
        return item; // service로 갈값
}


    async searchItem(items: Item[],sort:string, page:number, pageSize:number):Promise<Item[]|boolean>{
        // console.log(items);
        this.initializeDependencies();
        console.log(sort);

        if(sort=='PRICEASCEND'){
            items.sort((a, b) => {
                if (a.price < b.price) return -1;
                if (a.price > b.price) return 1;
                return 0;
          });
        }
        else if(sort=='PRICEDESCEND'){
            items.sort((a, b) => {
                if (a.price < b.price) return 1;
                if (a.price > b.price) return -1;
                return 0;
              });
        }
        
        else if(sort=='DATEASCEND'){ // 최신순
            items.sort((a, b) => {
                if (a.updatedAt < b.updatedAt) return 1;
                if (a.updatedAt > b.updatedAt) return -1;
                return 0;
              });
        }

        else if(sort=='DATEDESCEND'){  // 오래된순
            items.sort((a, b) => {
                if (a.updatedAt < b.updatedAt) return -1;
                if (a.updatedAt > b.updatedAt) return 1;
                return 0;
              });
            }

        // else{  // 최신순
        //     items.sort((a, b) => {
        //         if (a.createdAt < b.createdAt) return 1;
        //         if (a.createdAt > b.createdAt) return -1;
        //         return 0;
        //       });

              
        // }

        else{ console.log('sort error') }


        // return items;
        // pagenation으로 보내줘서 항상 가야함
        // 아래코드임
        let realItem = await items;
        return this.itemPaginationService.getPaginatedItems(page,pageSize,realItem);
    }


       
    
}