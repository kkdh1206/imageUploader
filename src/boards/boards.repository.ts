import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Board } from "./boards.entity";
import { Repository } from "typeorm";
import { BoardPaginationService } from "./pagination.service";
import { enumConvert } from "./enum-convert";
import { CreateBoardmDto } from "./DTO/create-board.dto";
import { User } from "src/auth/user.entity";


@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {

    private boardPaginationService: BoardPaginationService;
    private convert: enumConvert
    
    initializeDependencies(){
        this.boardPaginationService = new BoardPaginationService();
        this.convert = new enumConvert();
    }  


    async createBoard(createBoardDto: CreateBoardmDto,user: User):Promise<Board>{
        this.initializeDependencies();
        const {title, description, status} = createBoardDto;
        let realstatus = this.convert.statusConvert(status);
        const board = this.create({ 
            title,
            description,
            status: realstatus, 
         })
        await this.save(board);
        return board;
    }



    async sortBoards(boards:Board[], page:number, pageSize:number): Promise<Board[]|boolean>{
        this.initializeDependencies();
        boards.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return 1;
            if (a.updatedAt > b.updatedAt) return -1;
            return 0;
        });
        let realBoards = await boards;
        return this.boardPaginationService.getPaginatedBoards(page,pageSize,realBoards);
    }
}