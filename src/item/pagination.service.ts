import { Injectable } from '@nestjs/common';
import { ItemsService } from './item.service';
import { Item } from './item.entity';

@Injectable()
export class ItemPaginationService { // 페이지네이션을 작동하는 구문이다.

  async getPaginatedItems(page: number, pageSize: number, items: Item[]): Promise<Item[]|boolean> { 
    
    console.log(`item count =====${items.length}`)
    
    var itemCount = items.length
    console.log(page, pageSize);
    const startIndex = (page - 1) * pageSize;
    console.log(startIndex);
    console.log(itemCount);
    console.log('if문 시작')
    if( startIndex< itemCount){ // index는 0부터 시작이라 itemCount에서 1 빼줘야 할 지도 --> test 해보기!!!
    const endIndex = startIndex + pageSize;
    console.log('아이템 배송')
    return items.slice(startIndex, endIndex);
    }
    else{
    console.log('true 반환이다....')
    return true;
    }
  }
}