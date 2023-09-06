import { Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/boards/boards.repository';
import { CreateCommentDto } from './DTO/comment-dto';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        private boardRepository: BoardRepository,
        private commentRepository: CommentRepository
        ){}


    async createComment(createCommentDto: CreateCommentDto): Promise<Comment>{
        const {content, username, boardId} = createCommentDto;
        const board = await this.boardRepository.findOneBy({id: boardId});
        return this.commentRepository.createComment(content, username, board);
    }
}
