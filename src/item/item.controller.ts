import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, Delete, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe, UseGuards, Req, Query } from "@nestjs/common";
import { ItemsService } from "./item.service";
import { Item } from "./item.entity";
import { CreateItemDto } from "./DTO/create-item.dto";
import { ItemImage } from "./item.Image";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express/multer";
import { ItemType, ItemStatus } from "./item-status.enum";
import { ItemStateValidationPipe } from "./pipes/item-status-validation";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "src/auth/user.entity";
import { AuthService } from "src/auth/auth.service";
import { SearchItemDto } from "./DTO/search-item.dto";
import { ItemComment } from "src/itemComment/itemComment.entity";

// 플러터 dio 요청시 formData 는 사진 포함할때, json은 사진이 없을때 사용하면 된다.

@Controller('items') // 판매완료된 상품은 보이지 않게 하기
// 잠시꺼놓은것 테스트후 복구할 것 
@UseGuards(JwtAuthGuard) 
export class ItemsController {
    constructor(private itemsService: ItemsService,
                private itemImage: ItemImage
        ){}

    
    @Get() // - 페이지 네이션 된놈
    getAllItem(@Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10 ): Promise<Item[]|boolean> {
        return this.itemsService.getAllItems(searchItemDto, page, pageSize); // fltter 에 json 형태로 데이터 가면 변환해줘야함
    }

    // @Get('/itemCount')
    // getItemCount():Promise<number>{
    //     return
    // }

    // @Get() 
    // getAllItem(@Query() searchItemDto: SearchItemDto): Promise<Item[]> {
    //     return this.itemsService.getAll(searchItemDto); 
    // }

    // @Get('search')  -> /search?title="Dsdsdd%34%dsd&category=dddd&status page==20"
    // @Query('title') title;   
    
    @Get('search') // like 함수로 검색 쿼리 만들어주기
    searchItem(@Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10):Promise<Item[]|boolean>{  //--> 쿼리 설정 이거 어디서 받아오는지 알아보기
        return this.itemsService.getSearchedItem(searchItemDto, page, pageSize);
    }

    @Get('itemId/:id')  // id 는 플러터에 있을듯 이걸로 호출해도 되고 아니면 플러터에서 받은 값을 바탕으로 바로 처리해도 될듯 따라서 이건 쓸지 안쓸지는 선택!  
    async getItembyId(@Param('id') id: number) : Promise<User> { 
        var item = await this.itemsService.getItemById(id);
        item = await this.itemsService.getOwneruid(id);
        // console.log(item.user);
        return item.user;
    }

    @Get('id/:id')  // id 는 플러터에 있을듯 이걸로 호출해도 되고 아니면 플러터에서 받은 값을 바탕으로 바로 처리해도 될듯 따라서 이건 쓸지 안쓸지는 선택!  
    async getbyId(@Param('id') id: number) : Promise<String> { 
        var item = await this.itemsService.getItemById(id);
        item = await this.itemsService.getOwneruid(id);
        console.log(id);
        console.log(">>>>>>>>>>>>>>",item.title);
        // console.log(item.user);
        return item.title;
    }

    @Get('idList')  // id 는 플러터에 있을듯 이걸로 호출해도 되고 아니면 플러터에서 받은 값을 바탕으로 바로 처리해도 될듯 따라서 이건 쓸지 안쓸지는 선택!  
    async getbyIdList(@Body('id') idList: Array<number>) : Promise<Array<String>> { 
        console.log(idList);
        var titles=[];
        for(var i=0; i<idList.length; i++){
            var item = await this.itemsService.getItemById(idList[i]);
            if(item != null){
                titles.push(item.title);
            }
            
            console.log(item.title, " zzz ");
            
        }
        return titles;
    }

    @Get('imgList')  // id 는 플러터에 있을듯 이걸로 호출해도 되고 아니면 플러터에서 받은 값을 바탕으로 바로 처리해도 될듯 따라서 이건 쓸지 안쓸지는 선택!  
    async getbyImgList(@Body('id') idList: Array<number>) : Promise<Array<String>> { 
        console.log(idList);
        var images=[];
        for(var i=0; i<idList.length; i++){
            var item = await this.itemsService.getItemById(idList[i]);
            if(item !=null){
                images.push(item.ImageUrls);
            }
            
        }
        return images;
    }

    @Patch('imgList')  // id 는 플러터에 있을듯 이걸로 호출해도 되고 아니면 플러터에서 받은 값을 바탕으로 바로 처리해도 될듯 따라서 이건 쓸지 안쓸지는 선택!  
    async patchImgList(@Body('id') idList: Array<number>) : Promise<Array<String>> { 
        console.log(idList);
        var images=[];
        for(var i=0; i<idList.length; i++){
            var item = await this.itemsService.getItemById(idList[i]);
            if(item !=null){
                images.push(item.ImageUrls);
            }
            
        }
        return images;
    }

    // @Get('title/:title')  // id 별로 들어갈수 있게 해서 결론적으로 카테고리에서 검색해서 들어가든지 아니면 전체 아이템중에 찾아서 들어가든지 들어가면 items/:id 로 Get 하여 접근하게 만듬 
    // getItembyTitle(@Param('title') title:string) : Promise<Item[]> {  // 주소뒤에 title 적어서 접근하면 받아오게 만듬
    //     return this.itemsService.getItemByTitle(title);
    // }

    @Get('myItems') 
    getMyItems(
        @Req() req, // service 에서 getMyItems 가 작동하도록 매개변수 넣어줌
        @Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10 
    ): Promise<Item[]| boolean> {
        console.log('요청요청요청요청!!!!!!')
        // console.log('현재 오긴함 !!!!!!');
        return this.itemsService.getMyItems(req.user,searchItemDto,page,pageSize ); // 내가만든 가드에서 req.user 값을 가지고 있음
    }

    @Patch('myItems/patch/status/:id')
    patchItemStatus(
        // @Req() req,  -> 해주는게 좋지만 애초에 기능을 내아이템에서 수정 가능하게 만들거니까 필요없을듯?
        @Param('id') id:number,
        @Body('status') status:string
    ): Promise<Item>{
        console.log(status);
        return this.itemsService.patchItemStatus(id, status);
    }


    @Get('category') // 카테고리별 검색   ----> 더 좋은 방법 강구하기 너무 이 방법은 좀 별로인듯;;
    getItemdByCategory(
        @Body('category') category: string,
        @Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10
    ): Promise<Item[]| boolean> {
        console.log(page);
        return this.itemsService.getItemByCategory(category, searchItemDto, page, pageSize); 
    }

    @Get('fastSell')
    getFastSellItem(
        @Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10
    ): Promise<Item[]|boolean>{
        return this.itemsService.getFastSellItem(searchItemDto, page, pageSize)
    }

    // @Get('/:category/:status') // status 검색설정 -- TRADING 이면 TRADING 찾고 SOLDOUT이면 SOLDOUT 찾는 함수
    // getItemByStatus( // 차선책 찾아볼 것!!!
    // @Param('category') category: ItemCategory,
    // @Param('status') status: ItemStatus
    // ): Promise<Item[]> {
    //     return this.itemsService.getItemByStatus(category, status); 
    // }

        // 1. 이미지 업로드 해서 이미지 주소 돌려받는 것

        // 2. 이미지 주소와 나머지 정보들로 item을 만들어 에이터 베이스에 업로드 하는것
    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('image')) // 여기서 파일을 가져옴  ('image' == postman 에서 키랑 같다)키를 가진놈을 인터셉트하는것
    async uploadImage( // 바로 핸들러 밑에 함수에 인터셉트 파일을 전달해줌
        @UploadedFiles() image: Array<Express.Multer.File>, // 파일을 받는놈
        @Body() createItemDto : CreateItemDto, // dto 받는놈
        @Req() req

    ):Promise<Item>{// 이미지 주소도 가져오기
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\.');
    console.log(image);
    console.log(createItemDto); // 이까지 왓는지 확인용
    const imgList = [];
    for (var i=0;i<image.length; i++) {
        imgList.push(await this.itemImage.uploadImage(image[i])); // for문 처리해줌  -> 개수에 맞게 배열을 만들기 위해서
    }
    // const imageUrl1:string|null = await this.itemImage.uploadImage(image[0]); // 서비스에서 이미지 주소를 받음
    // const imageUrl2:string|null = await this.itemImage.uploadImage(image[1]);
    // const imageUrl3:string|null = await this.itemImage.uploadImage(image[2]);
    // const imageUrl4:string|null = await this.itemImage.uploadImage(image[3]);
    // const imageUrl5:string|null = await this.itemImage.uploadImage(image[4]);
    // const imageUrl:string[] = [imageUrl1.display_url, imageUrl2.display_url, imageUrl3.display_url] 
    return this.itemsService.createItem(createItemDto, imgList, req.user); // 이미지 데이터중 필요한 주소를 고름
}

    @Patch('/myItems/patch/item/:id') // 아이템 수정하는 기능  -> status랑 category string처리해서 반영 잘해주기!!!!!
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('image')) // 여기서 파일을 가져옴  ('image' == postman 에서 키랑 같다)키를 가진놈을 인터셉트하는것
    async updateItem(
        @UploadedFiles() image: Array<Express.Multer.File>,
        @Param('id') id:number,
        @Body() createItemDto : CreateItemDto):Promise<Item>
         {  
            const imgList = [];
            for (var i=0;i<image.length; i++) {
                imgList.push(await this.itemImage.uploadImage(image[i]));
            }

            return this.itemsService.updateItem(id,  createItemDto, imgList)
        }

    @Patch('/myItems/patch/image/:id')
    deleteImage(
        @Param('id',ParseIntPipe) id, 
        @Body() image       // 이건 받아올때 string이 아니라 json으로 온다. 근데 보통 dto에서 받으면 json 처리가 되버리지만 이렇게 받을거면 여기서 json을 파싱하든 아니면 보낼때 json이 아닌 string으로 보내줘야 한다.
    ): Promise<void>{
        console.log(image);
        return this.itemsService.deleteImage(id, image);
    }

    
    @Post('/myAlarmCategory')
    async addAlarm(
        @Req() req,
        @Body() category
    ):Promise<User>{
        
        const alarmCategory = category.category
        return this.itemsService.addAlarm(alarmCategory, req.user);
    }

    @Patch('/myAlarmCategory')
    async deleteAlarm(
        @Req() req,
        @Body() category
    ):Promise<User>{
        const alarmCategory = category.category
        return this.itemsService.deleteAlarm(alarmCategory, req.user);
    }

    @Get('/myAlarmCategory')
    async getAlarm(
        @Req() req,
    ):Promise<Array<string>>{
        return this.itemsService.getAlarm(req.user);
    }
        

    @Post('/myInterestedItem/:id') 
    async addInterested(
        @Req() req,
        @Param('id') id:number
    ):Promise<User>{
        return this.itemsService.addInterested(id, req.user);
    }

    @Patch('/myInterestedItem/:id')
    async deleteInterested(
        @Req() req,
        @Param('id') id:number
    ):Promise<User>{
        return this.itemsService.deleteInterested(id, req.user);
    }



    @Get('/myInterestedItem')
    async getInterested(
        @Req() req,
        @Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10 
    ): Promise <Item[]|boolean>{
        return this.itemsService.getInterested(req.user, searchItemDto, page, pageSize);
    }


    @Post('/myHistory/add') // 거래가 끝난 user한테 판매 완료
    async addHistory(
        @Req() req,
        @Body('id') id:number
    ):Promise<User>{
        
        return this.itemsService.addHistory(id, req.user);
    }

    @Patch('/myHistory/delete')
    async deleteHistory(
        @Body('id') id:number
    ) {
        console.log("오긴해???");
        return this.itemsService.deleteHistory(id);
    }



    @Get('/myHistory')
    async getHistory(
        @Req() req,
        @Query() searchItemDto: SearchItemDto, @Query('page') page:number, @Query('pageSize') pageSize: number = 10 
    ): Promise <Item[]|boolean>{
        return this.itemsService.getHistory(req.user, searchItemDto, page, pageSize);
    }

    @Get('comment/:id') // 여기서 아이디는 item의 아이디이다.
    getComment( @Param('id') id:number):Promise<ItemComment[]>{
        console.log('comment 받아오려고함')
        return this.itemsService.getComment(id);
    }


    
    @Delete('/:id') // 지웠다 표시만 나게 --> 나중에 검색해도 안나오게는 처리필요
    deleteItem(@Param('id',ParseIntPipe) id, 
    // @GetUser() user: User
    ): Promise<void>{
        return this.itemsService.deleteItem(id);
    }



}

