import { Body, Controller, Get, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtAuthGuard2 } from './jwt-auth.guard2';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService){}// controller에서 service 쓰려면 만들어 줘야함

    @Get('/username') // 파이어베이스에서 유저네임 등록 및 중복여부 확인  -- 회원가입 전에 닉네임 만들기
    checkUsername(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<boolean>{
        console.log(authCredentialsDto);
        const {username, Email} = authCredentialsDto
        // console.log('!!!!!!!!!!!!!!!!');
        // console.log(username);
        return this.authService.checkUsername(username); // 가능 불가능을 ture false로 반환해줌
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

    
}
