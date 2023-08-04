import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { initializeApp } from "firebase-admin/app";
import { applicationDefault } from "firebase-admin/app";
import * as firebase from 'firebase-admin';
import { Any } from "typeorm";

@Injectable()
export class JwtAuthGuard2 implements CanActivate {
    constructor() {}
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
            //console.log(req.uid);       
                // const user = await service.getUser(uid) // firebase uid를 가진 유저가 우리 db에 있는거 가져오기 
            return true;            
        } catch(e) {
            console.log(e);
        }
        return false;
       // 토큰에서 uid 가져오기
        console.log(token);


    }
}