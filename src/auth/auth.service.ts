import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { stringify } from 'querystring';
import { JwtService } from '@nestjs/jwt';
import { UserGrade, UserStatus } from './user-status.enum';
import { UserImage } from './user.image';
import { ItemRepository } from 'src/item/item.repository';

@Injectable()
export class AuthService {
    constructor(
        //@InjectRepository(USerRepository)  내가 만든 custom 은 이거 안씀
        private userRepository: UserRepository,
        //private itemRepository: ItemRepository,
        private jwtService: JwtService,
        private userImage : UserImage
    ){}// 여기가 body부분이라는데 무슨기능일까??

    async getAllUser(): Promise<User[]>{
        const users = await this.userRepository.find();
        let needList =[];
        for(let i=0; i<users.length; i++){
            let needs = {
                'username' : users[i].username, 
                'Email' : users[i].Email,
                'status' : users[i].userstatus,
                'online' : users[i].online
            }
                needList.push(needs);   
            }


        console.log(users);
        return needList
    }


    async signUp(authCredentialDto,uid) : Promise<void>{ //signUp 메소드 제작
        //console.log('컨트롤러는 통과');

        // 파이어베이스 상에서 중복인 경우 에러코드를 줘서 할 필요가 없다 그냥 EMail 의 Unique만 풀어주면됨
        // const { username, realname, Email, studentNumber } = authCredentialDto;
        // const userExist = await this.userRepository.findOne({where:{Email: Email}})
        // if(userExist == null || userExist.userstatus == UserStatus.DELETED){ // 이메일이 동일한 계정이 없거나 존재하더라도 삭제된 계정이면 true 반환
        //     return true
        // }
        // else {return false} // 이미 존재하는 계정인 경우
        return this.userRepository.createUser(authCredentialDto,uid); // 값 아무것도 없는데 왜 return 해줘야할까?? --> 그니까 null값이고 promise도 void로 잡았지
    } // 회원가입때는 반환값 있으면 'null 값이 not null 제약조건을 위반' 이 뜬다.

    async signIn(uid): Promise<User>{
        const user = await this.userRepository.findOne({where: {uid: uid}});
        if(user == null){
            console.log('user 존재하지 않음')
            console.log(`current user ===== ${user}`);
            // 만약에라도 발생할 오류에} 대해 대비가 되면 좋을듯??
        }
        user.online = true;
        await this. userRepository.save(user);
        return user
    }

    async getUser(uid):Promise<User>{
        const user = await this.userRepository.findOne({where: {uid: uid}});
        console.log(`getUser의 current user ===== ${user}`);
        return user
    }

    async checkUsername(name: string): Promise<boolean>{ 
        // findOneBy로 찾아지지 않는 이유는 name 은 String으로 받아오기 때문이다. --> 애초에 데이터 베이스에 있는것이라면 매개변수 name에 string이 아니라 ItemCategory 와 같은 클래스를 주면 찾아진다.
        const exist =  await this.userRepository.findOne({where: {username :name}}); // 여기 오류 있는듯 수정요망!!!! user에서 username 파트를 고쳐줘야함
        console.log(name);
        console.log(exist);
        if (name ==""|| name == "(알수없음)"){ return false} // 알수 없음 으로 회원탈퇴하면 할거라서
        else if (exist == null){return true} // ||exist.userstatus == UserStatus.DELETED
        else {return false}
    }

    async patchUserStatus(id:number){
        const user = await this.userRepository.findOneBy({id});
        user.userstatus = UserStatus.DELETED;
        user.username = "(알수없음)"; // 이름 알 수 없음으로 수정
        await this.userRepository.save(user);

        return user
    }

    async patchUserScore(id:number, score:number){
        const user = await this.userRepository.findOneBy({id});
        user.userScore = user.userScore + score;
        if(user.userScore >= 100){
            user.userGrade = UserGrade.Aplus;
        }
        else if(user.userScore >= 90){
            user.userGrade = UserGrade.A0;
        }
        else if(user.userScore >= 80){
            user.userGrade = UserGrade.Aminus;
        }
        else if(user.userScore >= 70){
            user.userGrade = UserGrade.Bplus;
        }
        else if(user.userScore >= 60){
            user.userGrade = UserGrade.B0;
        }
        else if(user.userScore >= 50){
            user.userGrade = UserGrade.Bminus;
        }
        else if(user.userScore >= 40){
            user.userGrade = UserGrade.Cplus;
        }
        else if(user.userScore >= 30){
            user.userGrade = UserGrade.C0;
        }
        else if(user.userScore >= 20){
            user.userGrade = UserGrade.Cminus;
        }
        else{
            user.userGrade = UserGrade.F;
        }

        await this.userRepository.save(user);

        return user
    }


    async patchUserInformationImage(imageUrl, uid){
        const user = await this.userRepository.findOne({where: {uid :uid}})
        user.imageUrl = imageUrl;
        await this.userRepository.save(user);
        return user
    }

    async patchUserInformationUsername(uid, username){
        const user = await this.userRepository.findOne({where: {uid :uid}})
        console.log(username);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111');
        user.username = username;
        console.log(user.username);
        await this.userRepository.save(user);
        return user
    }

    async fcmToken(uid, token){
        const user = await this.userRepository.findOne({where: {uid :uid}})
        user.FCM_token = token;
        await this.userRepository.save(user);
        console.log('저장된 토큰 ==', user.FCM_token);
        return user.FCM_token;
    }

    async getFcmToken(uid){
        const user = await this.userRepository.findOne({where: {uid :uid}})
        console.log('상대의 토큰 ==', user.FCM_token);
        return user.FCM_token;
    }

    async getFcmTokenList(category: string) {
        console.log(category);
        const founds = await this.userRepository.find();
        const matching = founds.filter(found => found.alarmList && found.alarmList.includes(category));
        return matching;
    }


    async addRequest(seller:User, itemId: number, buyer: string){
        const request = itemId.toString()+' '+seller.id.toString();
        console.log("1111111111");
        const user = await this.userRepository.findOne({where: {uid :buyer}}); // buyer 찾기
        console.log(user.username);
        user.requests.push(request); // request 푸시
        console.log("2222222222");
        await this.userRepository.save(user); // 변경내용 저장
        return request;
    }

    async getRequest(uid){
        const user = await this.userRepository.findOne({where:{uid:uid}});
        return user.requests;
    }

    async deleteRequest(seller:string, itemId: number, buyer: User){
        // const item = await this.itemRepository.findOne({where: {id: itemId}});
        console.log('???????????????????????????????????/');
        const request = itemId.toString()+' '+seller;
        console.log("itemId ", itemId)
        console.log("userId ", seller);
        console.log(request);
        const user = await this.userRepository.findOne({where: {uid :buyer.uid}}); // buyer 찾기
        
        user.requests = user.requests.filter((element) => element !== request); // 같지 않은 놈만 살림
        console.log(user.requests);
        await this.userRepository.save(user); // 변경내용 저장
        return user.requests;
    }
    
}

   

// string 과 String은 다르다!! 대문자 String은 클래스고 string은 문자열 자료형임
