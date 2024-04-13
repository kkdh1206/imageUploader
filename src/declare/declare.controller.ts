import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DeclaresService } from './declare.service';
import { Declare } from './declare.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDeclareDto } from './DTO/create-declare.dto';
import { User } from 'src/auth/user.entity';
// import { Comment } from 'src/comment/comment.entity';

@Controller('declare')
@UseGuards(JwtAuthGuard)
export class DeclaresController {
    constructor(private declaresService: DeclaresService){}

    @Get()
    getAllDeclares(
        @Query('page') page:number, @Query('pageSize') pageSize: number = 7
    ): Promise<Declare[]|boolean> {
        return this.declaresService.getAllDelcares(page,pageSize); // 삭제된건 걸러주기
    }

    @Get('search') // like 함수로 검색 쿼리 만들어주기
    async searchDeclare(@Query('title') title, @Query('page') page:number, @Query('pageSize') pageSize: number = 7):Promise<Declare[]|boolean>{  //--> 쿼리 설정 이거 어디서 받아오는지 알아보기
        console.log(`title ============${title}`);
        if(title != ""){
        return this.declaresService.getSearchDeclare(title, page, pageSize);
        }
        else{
            return true; // async 안하면 오류뜬다
        }
    }

    @Get('search/count')
    countSearchDeclares(@Query('title') title):Promise<number>{
        return this.declaresService.countSearchDeclares(title);
    }

    @Get('count')
    countDeclares():Promise<number>{
        return this.declaresService.countDeclares();
    }

    @Get('myDeclares')
    getMyDelcares(
        @Req() req
    ): Promise<Declare[]> {
        return this.declaresService.getMyDeclare(req.user); // 여기서 상태 삭제됨은 안띄워야함
    }

    @Post() 
    createDeclare(
        @Body() createDecalreDto: CreateDeclareDto,
        @Req() req
    ): Promise<Declare> {
        return this.declaresService.createDeclare(createDecalreDto, req.user);
    }

    @Get('declareId/:id')
    async getDeclareId(@Param('id') id:number) :Promise<User> {
        let declare = await this.declaresService.getDeclareId(id);
        return declare.user;
        
    }

    @Patch('myDeclares/:id')
    patchMyDeclare(
        @Param('id') id:number,
        @Body() createDeclareDto: CreateDeclareDto
    ):Promise<Declare>{
        return this.declaresService.patchMyDeclare(id,createDeclareDto);
    }

    @Patch('status/:id')
    patchStatus(
        @Param('id') id:number,
        @Body() status
    ): Promise<Declare>{
        let realstatus = status.status;
        console.log(realstatus);
        return this.declaresService.patchStatus(id, realstatus);
    }

    // @Get('comment/:id') // 여기서 아이디는 board의 아이디이다.
    // getComment( @Param('id') id:number):Promise<Comment[]>{
    //     console.log('comment 받아오려고함')
    //     return this.boardsService.getComment(id);
    // }
    
}
