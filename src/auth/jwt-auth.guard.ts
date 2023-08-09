import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { initializeApp } from "firebase-admin/app";
import { applicationDefault } from "firebase-admin/app";
import * as firebase from 'firebase-admin';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private authService : AuthService,
        
        ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        var req = context.switchToHttp().getRequest();
        var bearerToken = req.headers.authorization;
        var token = bearerToken.replace("Bearer ", '');
        // 토큰 검증 firebase.auth .... 
        // idToken comes from the client app
        try {
            var decodedToken = await firebase.auth().verifyIdToken(token);   
            console.log(decodedToken.uid);
            req.uid = decodedToken.uid        
                // const user = await service.getUser(uid) // firebase uid를 가진 유저가 우리 db에 있는거 가져오기
      //  req,user = user; 
            req.user = await this.authService.signIn(decodedToken.uid)// uuid 로 바꾸주기   uuid는 nestjs의 id   uid는 파이어베이스의 아이디
            return true;            
        } catch(e) {
            console.log(e);
        }
        return false;
       // 토큰에서 uid 가져오기
        console.log(token);


    }
}

// ... 문법 => 들오는 (우변의) 객체앞에 적으면 그 객체가 괄호가 안맞는걸 정의하거나 대입할때 사용하면 괄호를 알아서 알맞게 만들거나 풀어줌
// 중복도 걸러줄 수 있다.
