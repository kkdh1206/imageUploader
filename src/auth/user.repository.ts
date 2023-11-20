import { User } from "./user.entity";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { AuthCredentialsDto } from "./DTO/auth-credential.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'
import { Repository } from "typeorm";
import { UserGrade, UserStatus } from "./user-status.enum";

@CustomRepository(User) // user를 수정하는 커스텀 repository 라고 인식시켜주는 놈인듯
export class UserRepository extends Repository<User> {
    async createUser(authCredentialDto: AuthCredentialsDto, uid): Promise<void> {
        const { username, realname, Email, studentNumber } = authCredentialDto;

        const user = this.create({
            username : username,
            Email : Email,
            uid: uid, 
            userstatus : UserStatus.NORMAL,
            realname: realname,
            studentNumber : studentNumber,
            imageUrl: 'https://i.ibb.co/LPK9dGH/image.png',
            interestedId: [],
            alarmList: [],
            online: false,
            userGrade: UserGrade.F,
            userScore: 0,
            FCM_token: 'none',
        }); // password를 저장할때 hash처리된 놈을 보안을 위해 저장
        console.log(`current =================== ${user}`);
        console.log(user);

        try{ // user Entity에 저장하는 코드
            await this.save(user); // 저장이 될때 오류를 try catch 구문이 잡아줌 - 이를 하지 않으면 Controller 레벨로 가서 오류 internel error 500 오류가 뜬다
            // console.log('데이터베이스에 저장됨');
        } catch(error) {
            {
                throw new InternalServerErrorException(); // 그 외의 경우
            }
}
    }

}
