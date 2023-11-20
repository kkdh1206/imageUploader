import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { AuthModule } from 'src/auth/auth.module';
import { ItemRepository } from 'src/item/item.repository';
import { ItemCommentService } from './itemComment.service';
import { ItemCommentRepository } from './itemComment.repository';
import { ItemCommentController } from './itemComment.controller';
import { ItemComment } from './itemComment.entity';

@Module({
    imports:[ TypeOrmExModule.forCustomRepository([ItemCommentRepository,ItemRepository]),
    TypeOrmModule.forFeature([ItemComment]),
    AuthModule],
    controllers: [ItemCommentController],
    providers: [ItemCommentService]
})
export class ItemCommentModule {}
