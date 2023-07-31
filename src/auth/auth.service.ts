import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { stringify } from 'querystring';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from './user-status.enum';

@Injectable()
export class AuthService {
    constructor(
        //@InjectRepository(USerRepository)  내가 만든 custom 은 이거 안씀
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}// 여기가 body부분이라는데 무슨기능일까??

    async signUp(authCredentialDto,uid) : Promise<void>{ //signUp 메소드 제작
        //console.log('컨트롤러는 통과');
        return this.userRepository.createUser(authCredentialDto,uid); // 값 아무것도 없는데 왜 return 해줘야할까?? --> 그니까 null값이고 promise도 void로 잡았지
    } // 회원가입때는 반환값있으면 'null 값이 not null 제약조건을 위반' 이 뜬다.

    async signIn(uid): Promise<User>{
        const user = await this.userRepository.findOne({where: {uid: uid}});
        if(user == null){
            console.log('user 존재하지 않음')
            // 만약에라도 발생할 오류에 대해 대비가 되면 좋을듯??
        }
        return user
    }

    async checkUsername(name: string): Promise<boolean>{ 
        // findOneBy로 찾아지지 않는 이유는 name 은 String으로 받아오기 때문이다. --> 애초에 데이터 베이스에 있는것이라면 매개변수 name에 string이 아니라 ItemCategory 와 같은 클래스를 주면 찾아진다.
        const exist =  await this.userRepository.findOne({where: {username :name}}); // 여기 오류 있는듯 수정요망!!!! user에서 username 파트를 고쳐줘야함
        console.log(name);
        console.log(exist);
        if (exist == null){return true}
        else {return false}
    }

    async patchUserStatus(id:number, status:UserStatus){
        const user = await this.userRepository.findOneBy({id});
        user.userstatus = status;
        await this.userRepository.save(user);

        return user
    }
    
}

// string 과 String은 다르다!! 대문자 String은 클래스고 string은 문자열 자료형임
