import { Injectable } from '@nestjs/common';
import { Board } from './boards.entity';

@Injectable()
export class BoardPaginationService { // 페이지네이션을 작동하는 구문이다.

  async getPaginatedBoards(page: number, pageSize: number, boards: Board[]): Promise<Board[]|boolean> { 
    
    console.log(`item count =====${boards.length}`)
    
    var boardCount = boards.length
    console.log(page, pageSize);
    const startIndex = (page - 1) * pageSize;
    console.log(startIndex);
    console.log(boardCount);
    console.log('if문 시작')
    if( startIndex< boardCount){ // index는 0부터 시작이라 itemCount에서 1 빼줘야 할 지도 --> test 해보기!!!
    const endIndex = startIndex + pageSize;
    console.log('아이템 배송')
    return boards.slice(startIndex, endIndex);
    }
    else{
    console.log('true 반환이다....')
    return true;
    }
  }
}