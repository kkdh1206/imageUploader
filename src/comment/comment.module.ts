import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/boards.repository';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { CommentRepository } from './comment.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Module({
    imports:[ TypeOrmExModule.forCustomRepository([CommentRepository,BoardRepository]),
    TypeOrmModule.forFeature([Comment]),
    AuthModule],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule {}
