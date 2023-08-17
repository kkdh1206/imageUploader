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

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService,
                private userImage : UserImage,
        ){}// controller에서 service 쓰려면 만들어 줘야함

    // @Get('/username') // 파이어베이스에서 유저네임 등록 및 중복여부 확인  -- 회원가입 전에 닉네임 만들기
    // checkUsername(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<boolean>{
    //     console.log(authCredentialsDto);
    //     const {username, Email} = authCredentialsDto
    //     // console.log('!!!!!!!!!!!!!!!!');
    //     // console.log(username);
    //     return this.authService.checkUsername(username); // 가능 불가능을 ture false로 반환해줌
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

    @Patch('/patch/status/:id')  // 이건 데이터베이스에서 구현하기로 함  --> 그래서 이건 안쓰는 함수
    @UseGuards(JwtAuthGuard)
    patchUserStatus(
        @Req() req,  
        @Param('id') id:number,
        @Body('status') status:UserStatus
    ): Promise<User>{
        if (req.user.status==UserStatus.ADMIN){
        return this.authService.patchUserStatus(id, status);
    } 
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

    

}

    

