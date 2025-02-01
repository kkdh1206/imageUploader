import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { firstValueFrom, map } from "rxjs";
import * as config from 'config';
import { Repository } from "typeorm";
import { buffer } from "stream/consumers";
import { Injectable } from "@nestjs/common";
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserImage {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('AWS_ACCESS_KEY_ID:', this.configService.get<string>('AWS_ACCESS_KEY_ID'));
console.log('AWS_SECRET_ACCESS_KEY:', this.configService.get<string>('AWS_SECRET_ACCESS_KEY'));
console.log('AWS_REGION:', this.configService.get<string>('AWS_REGION'));
console.log('AWS_S3_BUCKET_NAME:', this.bucketName);

    const key = `${uuid()}-${file.originalname}`;
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ResponseContentDisposition: 'inline',
    };

    await this.s3.upload(params).promise();
    // return key;
    return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
  }




  // constructor(
    
  //   private readonly httpService: HttpService, 
  // ) {}


  // async uploadImage(image: Express.Multer.File) {
  //   console.log('여기 들어왔음')
  //   const apiConfig = config.get('api');
  //   const url = apiConfig.imgbb;

  //   const formData = new FormData(); 
  //   const buffer = Buffer.from(image.buffer); 
  //   const blob = new Blob([buffer]); 
  //   formData.append('image',blob ,image.originalname); 

  //   const { data } = await firstValueFrom( 
  //     this.httpService.post(url, formData).pipe(
  //       map((res) => {
  //         return res.data;
  //       }),
  //     ),
  //   );
  //   // console.log(data.display_url);
  //   return data.display_url;
  // }
}