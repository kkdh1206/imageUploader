import { Module } from '@nestjs/common';
import { ItemsModule } from './item/item.module';
import { ItemsService } from './item/item.service';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import { ChatBackEndGateway } from './socket.gateway.ts/socket.gateway';


@Module({
  imports: [ 
    ItemsModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({isGlobal : true}),
    AuthModule,
    BoardsModule,
    CommentModule,
    // ChatBackEndGateway
  ],
 
})
export class AppModule {}
