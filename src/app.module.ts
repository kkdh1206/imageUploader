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
// import { ChatBackEndGateway } from './socket.gateway/socket.gateway';
import { ItemCommentModule } from './itemComment/itemComment.module';


@Module({
  imports: [ 
    ItemsModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({isGlobal : true,
      envFilePath: 'environment.env', // .env 파일을 로드함
    }),
    AuthModule,
    BoardsModule,
    CommentModule,
    ItemCommentModule,
    // ChatBackEndGateway
  ],
 
})
export class AppModule {}
