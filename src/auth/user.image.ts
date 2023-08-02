import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { firstValueFrom, map } from "rxjs";
import * as config from 'config';
import { Repository } from "typeorm";
import { buffer } from "stream/consumers";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserImage {
  constructor(
    
    private readonly httpService: HttpService, 
  ) {}


  async uploadImage(image: Express.Multer.File) {
    const apiConfig = config.get('api');
    const url = apiConfig.imgbb;

    const formData = new FormData(); 
    const buffer = Buffer.from(image.buffer); 
    const blob = new Blob([buffer]); 
    formData.append('image',blob ,image.originalname); 

    const { data } = await firstValueFrom( 
      this.httpService.post(url, formData).pipe(
        map((res) => {
          return res.data;
        }),
      ),
    );
    return data.display_url;
  }
}