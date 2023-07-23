import { Module } from '@nestjs/common';
import { ItemsController } from  "./item.controller"
import { ItemsService } from './item.service';
import { ItemRepository } from './item.repository';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { ItemImage } from './item.Image';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[TypeOrmExModule.forCustomRepository([ItemRepository]), TypeOrmModule.forFeature([Item]), HttpModule, AuthModule
    ], // 다른 모듈을 쓰는경우    -- 위에 import는 파일 연관정도만이고 실제 필요한건 import 여기다 해줘야함  -- 모듈만 import함
    controllers :[ItemsController], // 사용자의 요청을 받는놈
    providers : [ItemsService, ItemImage] // 서비스들  -- @injectable 들어간놈들 대부분
})
export class ItemsModule{}