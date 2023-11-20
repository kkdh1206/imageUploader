import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Board } from "src/boards/boards.entity";
import { BoardRepository } from "src/boards/boards.repository";
import { Item } from "src/item/item.entity";
import { ItemComment } from "./itemComment.entity";

@CustomRepository(ItemComment)
export class ItemCommentRepository extends Repository<ItemComment> {
    

    async createComment(content:string, username: string, item:Item):Promise<ItemComment>{
        const comment = this.create({ 
            content: content,
            username: username,
            item: item
         })
        await this.save(comment);
        console.log(comment);
        return comment;
    }

}