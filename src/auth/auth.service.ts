import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { stringify } from 'querystring';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        //@InjectRepository(USerRepository)  내가 만든 custom 은 이거 안씀
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}// 여기가 body부분이라는데 무슨기능일까??

    async signUp(authCredentialDto) : Promise<void>{ //signUp 메소드 제작
        return this.userRepository.createUser(authCredentialDto); // 값 아무것도 없는데 왜 return 해줘야할까?? --> 그니까 null값이고 promise도 void로 잡았지
    } // 회원가입때는 반환값있으면 'null 값이 not null 제약조건을 위반' 이 뜬다.

    async signIn(uid): Promise<User>{
        const user = await this.userRepository.findOneBy({uid});
        if(user == null){
            console.log('user 존재하지 않음')
            // 만약에라도 발생할 오류에 대해 대비가 되면 좋을듯??
        }
        return user
    }

    async checkUsername(username: string): Promise<boolean>{
        const exist =  await this.userRepository.findOneBy({username});
        if (exist == null){return true}
        else {return false}
    }
    
}