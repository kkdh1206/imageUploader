import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { GroupsService } from './group.service';
import { Group } from './group.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGroupDto } from './DTO/create-group.dto';
import { User } from 'src/auth/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GroupImage } from './group.Image';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupsController {
    constructor(private groupsService: GroupsService,
        private groupImage: GroupImage
        
    ){}

    @Get()
    getAllGroups(
        @Query('page') page:number, @Query('pageSize') pageSize: number = 7
    ): Promise<Group[]|boolean> {
        return this.groupsService.getAllgroups(page,pageSize); // 삭제된건 걸러주기
    }

    @Get('search') // like 함수로 검색 쿼리 만들어주기
    async searchGroup(@Query('title') title, @Query('page') page:number, @Query('pageSize') pageSize: number = 7):Promise<Group[]|boolean>{  //--> 쿼리 설정 이거 어디서 받아오는지 알아보기
        console.log(`title ============${title}`);
        if(title != ""){
        return this.groupsService.getSearchGroup(title, page, pageSize);
        }
        else{
            return true; // async 안하면 오류뜬다
        }
    }

    @Get('search/count')
    countSearchGroup(@Query('title') title):Promise<number>{
        return this.groupsService.countSearchGroups(title);
    }

    @Get('count')
    countGroup():Promise<number>{
        return this.groupsService.countGroups();
    }

    @Get('myGroups')
    getMyGroup(
        @Req() req
    ): Promise<Group[]> {
        return this.groupsService.getMyGroups(req.user); // 여기서 상태 삭제됨은 안띄워야함
    }

    @Post() 
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('image'))
    async createGroup(
        @UploadedFiles() image: Array<Express.Multer.File>,
        @Body() createGroupDto: CreateGroupDto,
        @Req() req
    ): Promise<Group> {
        const imgList = [];
    for (var i=0;i<image.length; i++) {
        imgList.push(await this.groupImage.uploadImage(image[i])); // for문 처리해줌  -> 개수에 맞게 배열을 만들기 위해서
    }
        return this.groupsService.createGroup(createGroupDto, req.user, imgList);
    }

   

    @Get('groupId/:id')
    async getGroupId(@Param('id') id:number) :Promise<User> {
        let group = await this.groupsService.getGroupId(id);
        return group.user;
        
    }

    @Post('/myInterestedItem/:id') 
    async addInterested(
        @Req() req,
        @Param('id') id:number
    ):Promise<User>{
        return this.groupsService.addInterestedGroup(id, req.user);
    }

    @Patch('/myInterestedItem/:id')
    async deleteInterested(
        @Req() req,
        @Param('id') id:number
    ):Promise<User>{
        return this.groupsService.deleteInterestedGroup(id, req.user);
    }


    @Patch('myGroups/:id')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('image'))
    async patchMyGroup(
        @UploadedFiles() image: Array<Express.Multer.File>,
        @Param('id') id:number,
        @Body() createGroupDto: CreateGroupDto, status:string
    ):Promise<Group>{
        const imgList = [];
    for (var i=0;i<image.length; i++) {
        imgList.push(await this.groupImage.uploadImage(image[i])); // for문 처리해줌  -> 개수에 맞게 배열을 만들기 위해서
    }
        return this.groupsService.patchMyGroup(id,createGroupDto, status, imgList);
    }

    @Patch('status/:id')
    patchStatus(
        @Param('id') id:number,
        @Body() status
    ): Promise<Group>{
        let realstatus = status.status;
        console.log(realstatus);
        return this.groupsService.patchStatus(id, realstatus);
    }

    // @Get('comment/:id') // 여기서 아이디는 board의 아이디이다.
    // getComment( @Param('id') id:number):Promise<Comment[]>{
    //     console.log('comment 받아오려고함')
    //     return this.boardsService.getComment(id);
    // }
    
}
