import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ItemCreateCommentDto } from './DTO/itemComment-dto';
import { ItemCommentService } from './itemComment.service';
import { ItemComment } from './itemComment.entity';


@Controller('itemComment')
@UseGuards(JwtAuthGuard)
export class ItemCommentController {
  constructor(private readonly itemCommentService: ItemCommentService) {}

  
  @Post()
  async createComment(@Req() req, @Body() itemCreateCommentDto: ItemCreateCommentDto): Promise<ItemComment> {
    console.log('post (Comment) 요청옴')
    return this.itemCommentService.createComment(itemCreateCommentDto);
  }



}