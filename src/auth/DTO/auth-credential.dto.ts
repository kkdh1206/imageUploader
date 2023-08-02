import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(1) // 최소길이 1 이상  이런식으로 유효성에 제한을 두어서 원하는 형식대로 회원가입 하게 함
    @MaxLength(10)
    username : string; // 사실상 이놈만 여기서 새로 받는 dto 이고  나머지 Email 과 password 는 파이어베이스에서 받아온다

    Email: string;

    studentNumber: number;

}

// 일단 dto 그대로 긁어 왔지만 이거 말고 여기다가 파이어베이스에서 받은거 가져와서 써야할듯