import { Module } from '@nestjs/common';
import { ItemsModule } from './item/item.module';
import { ItemsService } from './item/item.service';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ 
    ItemsModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({isGlobal : true}),
    AuthModule,
  ]

})
export class AppModule {}
