import { Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/boards/boards.repository';
import {  ItemCreateCommentDto } from './DTO/itemComment-dto';
import { ItemRepository } from 'src/item/item.repository';
import { ItemComment } from './itemComment.entity';
import { ItemCommentRepository } from './itemComment.repository';

@Injectable()
export class ItemCommentService {
    constructor(
        private itemRepository: ItemRepository,
        private itemCommentRepository: ItemCommentRepository
        ){}


    async createComment(createCommentDto: ItemCreateCommentDto): Promise<ItemComment>{
        const {content, username, itemId} = createCommentDto;
        const item = await this.itemRepository.findOneBy({id: itemId});
        return this.itemCommentRepository.createComment(content, username, item);
    }
}
