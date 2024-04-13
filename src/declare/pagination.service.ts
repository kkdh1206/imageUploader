import { Injectable } from '@nestjs/common';
import { Declare } from './declare.entity';

@Injectable()
export class DeclarePaginationService { // 페이지네이션을 작동하는 구문이다.

  async getPaginatedDeclares(page: number, pageSize: number, declares: Declare[]): Promise<Declare[]|boolean> { 
    
    console.log(`declare count =====${declares.length}`)
    
    var boardCount = declares.length
    console.log(page, pageSize);
    const startIndex = (page - 1) * pageSize;
    console.log(startIndex);
    console.log(boardCount);
    console.log('if문 시작')
    if( startIndex< boardCount){ // index는 0부터 시작이라 itemCount에서 1 빼줘야 할 지도 --> test 해보기!!!
    const endIndex = startIndex + pageSize;
    console.log('아이템 배송')
    return declares.slice(startIndex, endIndex);
    }
    else{
    console.log('true 반환이다....')
    return true;
    }
  }
}