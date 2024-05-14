import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Item } from "./item.entity";
import { firstValueFrom, map } from "rxjs";
import * as config from 'config';
import { Repository } from "typeorm";
import { buffer } from "stream/consumers";
import { Injectable } from "@nestjs/common";


//item service의 일종

    // 사진 주소를 받아와야함
// @CustomRepository(Item)
@Injectable()
export class ItemImage {
  constructor(
    
    private readonly httpService: HttpService,          // axios 의 패키지중 하나
    private readonly configService: ConfigService,      // 사실 필요가 없다... env 설정때 쓰는놈
  ) {}


  async uploadImage(image: Express.Multer.File) { // 사진 한개 업로드 해주는 함수
    const apiConfig = config.get('api');
    const url = apiConfig.imgbb; // 하나의 주소로 보내주면 알아서 imgbb가 처리해줌

    // 서버에는 config 파일이 있지만 개발할때 안보여주려고 config 처리해주는것!

    // const imageExist = Boolean (image)
    // if(!imageExist){
    //   return 'https://i.ibb.co/1KFG5BG/no-image01.gif'
    // } 이부분은 플러터에서 구현을 하는게 좋다고 한다!!
console.log("이까진 돌아감");


    const formData = new FormData(); // 이미지 파일, dto를 같이 저장하는 타입  -- 데이터 보내는 타입중하나
    const buffer = Buffer.from(image.buffer); // 데이터를 잠시 맡아주는 역할    -- buffer 변수저장기능이라고 알아두기
    // blob은 파일을 까서 데이터화 해서 전송할 수 있게 해줌  --  buffer 로받아서 blob으로 전송한다.
    const blob = new Blob([buffer]); // ????  https://stackoverflow.com/questions/61731218/conversion-of-buffer-data-to-blob-in-nodejs
    formData.append('image',blob ,image.originalname); // body를 만들어줌 == payload 제작

    console.log("이까진 돌아감????");

    const { data } = await firstValueFrom( // data라는놈만 추출   -- firstValueForm 은 요청해서 받을때 쓰임 정확한건 찾아보기
      
    this.httpService.post(url, formData).pipe( // data를 받는다 정도만 알아도 될듯
        map((res) => {
          console.log(res.data);
          return res.data;
          console.log("여긴가???");
        }),
      ),
    );
    return data.display_url;
  }
}


// 클래스는 기능하는 용도의 함수 변수의 타입이 아님
