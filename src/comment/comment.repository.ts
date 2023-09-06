import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./DTO/comment-dto";
import { Board } from "src/boards/boards.entity";
import { Comment } from "./comment.entity";
import { BoardRepository } from "src/boards/boards.repository";

@CustomRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    

    async createComment(content:string, username: string, board:Board):Promise<Comment>{
        const comment = this.create({ 
            content: content,
            username: username,
            board: board
         })
        await this.save(comment);
        console.log(comment);
        return comment;
    }

}