import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtAuthGuard2 } from './jwt-auth.guard2';
import { UserStatus } from './user-status.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserImage } from './user.image';
import { get } from 'http';
import { UserRepository } from './user.repository';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService,
                private userImage : UserImage,
                private userRepository: UserRepository
        ){}// controller에서 service 쓰려면 만들어 줘야함

    @Get('/username') // 파이어베이스에서 유저네임 등록 및 중복여부 확인  -- 회원가입 전에 닉네임 만들기
    checkUsername(@Body('username') username):Promise<boolean>{ // 이거 통과안되면 회원가입 안되게 만들기
        // console.log(authCredentialsDto);
        // const {username, Email} = authCredentialsDto
        // // console.log('!!!!!!!!!!!!!!!!');
        // // console.log(username);
        return this.authService.checkUsername(username); // 가능 불가능을 ture false로 반환해줌
    }

    @Get('/userid/:id') // 파이어베이스에서 유저네임 등록 및 중복여부 확인  -- 회원가입 전에 닉네임 만들기
    async getUserById(@Param('id') id ):Promise<User>{ // 이거 통과안되면 회원가입 안되게 만들기
        const user = await this.userRepository.findOneBy({id});
        return user; // 가능 불가능을 ture false로 반환해줌
    }

    @Get('/userUid') 
    async getUserByUid(@Body('userUid') uid ):Promise<String>{
        const user = await this.userRepository.findOne({where:{uid: uid}})
        return user.username;
    }

    @Get('/userToImage') 
    async getUserImage(@Body('username') name ):Promise<String>{
        const user = await this.userRepository.findOne({where:{username: name}})
        console.log(name);
        console.log(user.imageUrl);
        return user.imageUrl;
    }

    @Patch('/setChatAlarm') 
    @UseGuards(JwtAuthGuard)  
    async setChatAlarm(@Req() req, @Body('bool') bool) :Promise<void>{
        const user = await this.userRepository.findOne({where:{uid:req.uid}});
        user.chatAlarm = bool;
        await this.userRepository.save(user);
    }

    @Patch('/setCategoryAlarm') 
    @UseGuards(JwtAuthGuard)  
    async setCategoryAlarm(@Req() req, @Body('bool') bool) :Promise<void>{
        const user = await this.userRepository.findOne({where:{uid:req.uid}});
        user.categoryAlarm = bool;
        await this.userRepository.save(user);
    }

    // @Get('/getAlarm') // 짜피 안써서 수정도 안함
    // @UseGuards(JwtAuthGuard)  
    // async getAlarm(@Req() req) :Promise<boolean>{
    //     const user = await this.userRepository.findOne({where:{uid:req.uid}});
    //    return user.alarm;
    // }


    @Get('/userInfo') 
    @UseGuards(JwtAuthGuard)  // 2?
    getUserInfo(@Req() req):Promise<User>{
    
        return this.authService.getUser(req.uid)
    }


    @Get('/allUser')
    @UseGuards(JwtAuthGuard)
    getAllUser():Promise<User[]> {
        return this.authService.getAllUser()
    }

    @Post('/signup') // 파이어베이스에서 회원가입한 경우  -- 여긴 토큰 필요없음
    @UseGuards(JwtAuthGuard2)  //---> 추후에 이걸 넣을거면 useGuards를 보완해야함!!!!!!
    signUp(@Req() req,
        @Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto
        ): Promise<void> { 
            // console.log(authCredentialsDto);
            // console.log(req.uid);
        return this.authService.signUp(authCredentialsDto,req.uid);
    }

    @Post('/signin') // 파이어베이스 에서 로그인한 경우  -- 여기도 토큰 필요없음 근데 토큰을 반환할 예정
    @UseGuards(JwtAuthGuard)
    signIn(
        @Req() req
    ): Promise <User> {
        // const token = req.headers.authorization.split(' ')[1]; // Bearer your-jwt-token인데 공백으로 분리해 앞에놈만 가져온거임
        return this.authService.signIn(req.uid);
    }

    @Patch('/fcmToken')
    @UseGuards(JwtAuthGuard)
    patchFcmToken(
        @Req() req,
        @Body() fcmToken
    ): Promise<string> {
        const token = fcmToken.fcmToken
        console.log('????????????')
        console.log(token);
        return this.authService.fcmToken(req.uid, token);
    }

    @Patch('/patch/status/:id')  // 회원 탈퇴를 위해서 DELETED 만 존재함
    @UseGuards(JwtAuthGuard)
    patchUserStatus(
        @Req() req,  
        @Param('id') id:number,
        // @Body('status') status:String
    ): Promise<User>{
        // if (req.user.status==UserStatus.ADMIN){
        return this.authService.patchUserStatus(id);
    // } 
 }

    @Patch('/userScore/:id')
    @UseGuards(JwtAuthGuard)
    patchUserScore(
        @Req() req,
        @Param('id') id:number,
        @Body('score') score:number
    ): Promise<User>{
        return this.authService.patchUserScore(id,score);
    }

    @Patch('/patch/userinformation/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async patchUserInformationImage(
        @UploadedFile() image: Express.Multer.File,
        @Req() req, 
    ): Promise<User> {
        let imageUrl;
        imageUrl = await this.userImage.uploadImage(image)
        return this.authService.patchUserInformationImage(imageUrl, req.uid);
    } 

    @Patch('/patch/userinformation/image2')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async patchUserInformationImage2(
        @Body() url,
        @Req() req, 
    ): Promise<User> {
        let imageUrl = url.imageurl;
        return this.authService.patchUserInformationImage(imageUrl, req.uid);
    } 

    @Patch('/patch/userinformation/username')
    @UseGuards(JwtAuthGuard)
    async patchUserInformationUsername(
        @Req() req, 
        @Body() username
    ): Promise<User> {
        console.log(username);
        // console.log(image);
        const name = username.username;  // json 파싱하는 코드
        return this.authService.patchUserInformationUsername(req.uid, name);
    } 


    @Get('/fcmToken')
    @UseGuards(JwtAuthGuard)
    getFcmToken(
        @Body() data
    ): Promise<string> {
        const uid = data.uid
        console.log('????????????')
        console.log(uid);
        return this.authService.getFcmToken(uid);
    }

    @Post('/request')
    @UseGuards(JwtAuthGuard)
    addRequest(
        @Body() data,
        @Req() req
    ): Promise<string>{
        console.log('-------------------');
        console.log(data);
        console.log(data)
        console.log('-------------------');

        const buyerid = data.buyerUid;
        const itemId = data.itemId;
        console.log(itemId);
        let seller = req.user;
        return this.authService.addRequest(seller, itemId, buyerid); // 판사람 물건id, 구매한 사람
    }

    @Get('/fcmTokenByCategory')
    @UseGuards(JwtAuthGuard)
    async getFcmTokenList(@Body('category') data): Promise<Array<String>> {
        var tokens = [];
        var dataCategory;
        if(data.category == "Book") {
            dataCategory = "책"
        }
        else if(data.category == "CLOTHES") {
            dataCategory = "의류"
        }
        else if(data.category == "REFRIGERATOR") {
            dataCategory = "냉장고"
        }
        else if(data.category == "MONITOR") {
            dataCategory = "모니터"
        }
        else if(data.category == "ROOM") {
            dataCategory = "자취방"
        }
        else if(data.category == "ETC") {
            dataCategory = "ETC"
        }

        const founds = await this.authService.getFcmTokenList(dataCategory);
        if(founds != null) {
            for (const found in founds) {
                tokens.push(founds[found].FCM_token);
            }
        }
        else {
            tokens.push("해당유저없음");
        }
        return tokens;
    }


    @Get('/request')
    @UseGuards(JwtAuthGuard)
    getRequest(
        @Req() req
    ): Promise<string[]>{
        const user = req.user;
        return this.authService.getRequest(user.uid); 
    }

    @Patch('/request')
    @UseGuards(JwtAuthGuard)
    deleteRequest(
        @Req() req,
        @Body() data
    ): Promise<string[]>{
        const buyer = req.user
        // console.log(buyer.id);
        const sellerid = data.sellerId;
        const itemId = data.itemId;
        return this.authService.deleteRequest(sellerid, itemId, buyer); 
    }

   

}
