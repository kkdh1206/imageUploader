import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './DTO/comment-dto';
import { Comment } from './comment.entity';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  
  @Post()
  async createComment(@Req() req, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    console.log('post (Comment) 요청옴')
    return this.commentService.createComment(createCommentDto);
  }


//   @Get()
//   async getMyComments(@Request() req) {
//     return this.commentService.getCommentsByUserId(req.user.id);
//   }
}