import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, Delete, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe, UseGuards, Req } from "@nestjs/common";
import { ItemsService } from "./item.service";
import { Item } from "./item.entity";
import { CreateItemDto } from "./DTO/create-item.dto";
import { ItemImage } from "./item.Image";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express/multer";
import { ItemCategory, ItemStatus } from "./item-status.enum";
import { ItemStateValidationPipe } from "./pipes/item-status-validation";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "src/auth/user.entity";
import { AuthService } from "src/auth/auth.service";


// 가드 추가하기 -- > 유저 판단용 아이템차원에서  --> user = uuid 로 찾아줘서 선언해놓기
@Controller('items')
@UseGuards(JwtAuthGuard) 
export class ItemsController {
    constructor(private itemsService: ItemsService,
                private itemImage: ItemImage
        ){}

    
    @Get() 
    getAllItem(): Promise<Item[]> {
        return this.itemsService.getAllItems(); // fltter 에 json 형태로 데이터 가면 변환해줘야함
    }

    @Get('/:id')  // id 별로 들어갈수 있게 해서 결론적으로 카테고리에서 검색해서 들어가든지 아니면 전체 아이템중에 찾아서 들어가든지 들어가면 items/:id 로 Get 하여 접근하게 만듬 
    getItemId(@Param('id') id:number) : Promise<Item> { 
        return this.itemsService.getItemById(id);
    }

    @Get('/myItems') 
    getMyItems(
        @Req() req // service 에서 getMyItems 가 작동하도록 매개변수 넣어줌
    ): Promise<Item[]> {
        return this.itemsService.getMyItems(req.user); // 내가만든 가드에서 req.user 값을 가지고 있음
    }


    @Get('/:category') // 카테고리별 검색
    getItemdByCategory(
        @Param('category') category: ItemCategory
    ): Promise<Item[]> {
        return this.itemsService.getItemByCategory(category); 
    }

    @Get('/:category/:status') // status 검색설정 -- TRADING 이면 TRADING 찾고 SOLDOUT이면 SOLDOUT 찾는 함수
    getItemByStatus( // 차선책 찾아볼 것!!!
    @Param('category') category: ItemCategory,
    @Param('status') status: ItemStatus
    ): Promise<Item[]> {
        return this.itemsService.getItemByStatus(category, status); 
    }

        // 1. 이미지 업로드 해서 이미지 주소 돌려받는 것

        // 2. 이미지 주소와 나머지 정보들로 item을 만들어 에이터 베이스에 업로드 하는것
    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('image')) // 여기서 파일을 가져옴  ('image' == postman 에서 키랑 같다)키를 가진놈을 인터셉트하는것
    async uploadImage( // 바로 핸들러 밑에 함수에 인터셉트 파일을 전달해줌
        @UploadedFiles() image: Array<Express.Multer.File>, // 파일을 받는놈
        @Body() createItemDto : CreateItemDto, // dto 받는놈

    ):Promise<Item>{// 이미지 주소도 가져오기
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
    return this.itemsService.createItem(createItemDto, imgList); // 이미지 데이터중 필요한 주소를 고름
}

    // @Patch(':id/patch')
    // @UsePipes(ValidationPipe)
    // @UseInterceptors(FilesInterceptor('image')) // 여기서 파일을 가져옴  ('image' == postman 에서 키랑 같다)키를 가진놈을 인터셉트하는것
    // async updateItem(
    //     @UploadedFiles() image: Array<Express.Multer.File>,
    //     @Param('id', ParseIntPipe) id:number,
    //     @Body('status',ItemStateValidationPipe) status:ItemStatus
    //     ) {
    //         return this.itemsService.updateItem(id,status, image)
    //     }
    
    @Delete('/:id')
    deleteItem(@Param('id',ParseIntPipe) id, 
    // @GetUser() user: User
    ): Promise<void>{
        return this.itemsService.deleteItem(id);
    }



}

