import {Controller,Post,UploadedFile,UseInterceptors,Get,Param,Res} from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UploadService } from './upload.service';
  import { Response } from 'express';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
  
    @Post() // -> 여러개 할꺼면 여러개 받는거 만들고 uploadService.uploadFiles 저거 여러번 호출해서 list로 반환해주기
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      const url = await this.uploadService.uploadImage(file);
      return { url };
    }

  //   @Get('/a')
  //   up(){
  //     console.log("aaaaaaaaaaa");
  //     return true;
  //   }
  
  //   @Get('/file/:key')
  //   async getFile(@Param('key') key: string, @Res() res: Response) {
  // const file = await this.uploadService.getFiles(key);
  // res.setHeader('Content-Type', file.ContentType);
  // res.send(file.Body); // Buffer 또는 string을 직접 응답으로 전송
// }
  }
  