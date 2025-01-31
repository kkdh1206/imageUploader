import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
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

  // async getFiles(key: string): Promise<S3.GetObjectOutput> {
  //   const params = {
  //     Bucket: this.bucketName,
  //     Key: key,
  //   };

  //   return this.s3.getObject(params).promise();
  // }
}
