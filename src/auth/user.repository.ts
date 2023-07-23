import { User } from "./user.entity";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { AuthCredentialsDto } from "./DTO/auth-credential.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'
import { Repository } from "typeorm";

@CustomRepository(User) // user를 수정하는 커스텀 repository 라고 인식시켜주는 놈인듯
export class UserRepository extends Repository<User> {
    async createUser(authCredentialDto: AuthCredentialsDto,uid): Promise<void> {
        const { username, Email } = authCredentialDto;

        const user = this.create({
            username : username,
            Email : Email,
            uid: uid 
        }); // password를 저장할때 hash처리된 놈을 보안을 위해 저장
        
        try{ // user Entity에 저장하는 코드
            await this.save(user); // 저장이 될때 오류를 try catch 구문이 잡아줌 - 이를 하지 않으면 Controller 레벨로 가서 오류 internel error 500 오류가 뜬다
        } catch(error) {
            if(error.code == '23505') {
                throw new ConflictException('Existing username'); // console을 통해 구한 에러코드 즉, username 이미 있는경우  -> 근데 플러터에서 애초에 검사 버튼 눌러서 이건 쓸일 없을듯
            } else{
                throw new InternalServerErrorException(); // 그 외의 경우
            }
}
    }
}
