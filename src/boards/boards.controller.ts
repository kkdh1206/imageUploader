import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateBoardmDto } from './DTO/create-board.dto';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
    constructor(private boardsService: BoardsService){}

    @Get()
    getAllBoards(
        @Query('page') page:number, @Query('pageSize') pageSize: number = 7
    ): Promise<Board[]|boolean> {
        return this.boardsService.getAllBoards(page,pageSize); // 삭제된건 걸러주기
    }

    @Get('search') // like 함수로 검색 쿼리 만들어주기
    searchItem(@Query() title, @Query('page') page:number, @Query('pageSize') pageSize: number = 7):Promise<Board[]|boolean>{  //--> 쿼리 설정 이거 어디서 받아오는지 알아보기
        let realtitle = title.title;
        return this.boardsService.getSearchedBoard(realtitle, page, pageSize);
    }

    @Get('myBoards')
    getMyBoards(
        @Req() req
    ): Promise<Board[]> {
        return this.boardsService.getMyBoards(req.user); // 여기서 상태 삭제됨은 안띄워야함
    }

    @Post() 
    createBoard(
        @Body() createBoardDto: CreateBoardmDto,
        @Req() req
    ): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto, req.user);
    }

    @Get('boardId/:id')
    async getBoardId(@Param('id') id:number) :Promise<User> {
        let board = await this.boardsService.getBoardId(id);
        return board.user;
        // 여기서 이 board의 상태에 따라 public이면 유저 보내주고 Private이면 bool로 false보내주면 될 듯
    }

    @Patch('myBoards/:id')
    patchMyBoard(
        @Param('id') id:number,
        @Body() createBoardmDto: CreateBoardmDto
    ):Promise<Board>{
        return this.boardsService.patchMyBoard(id,createBoardmDto);
    }

    @Patch('status/:id')
    patchStatus(
        @Param('id') id:number,
        @Body() status
    ): Promise<Board>{
        let realstatus = status.status;
        return this.boardsService.patchStatus(id, realstatus);
    }
    
}
