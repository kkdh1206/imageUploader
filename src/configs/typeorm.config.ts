import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import * as config from 'config';
import { User } from "src/auth/user.entity"
import { Item } from "src/item/item.entity"

const dbConfig = config.get('db')

export const typeORMConfig : TypeOrmModuleOptions = {
    type: dbConfig.type, // config 파일로 이런 내용은 넣어놓아서 사용
    host: process.env.RDS_HOSTNAME || dbConfig.host, // aws와 같은 데이터베이스에 이미 hostname 이 정의 되있으면 그걸 가져오고 아니면 dbConfig에서 가져옴
    port: process.env.RDS_PORT || dbConfig.port, // RDS_PORT 와 같은 이름은 환경변수 정의시 RDS_PORT라고 주었기 때문에 이렇게 사용된다.
    username: process.env.RDS_USERNAME || dbConfig.username,
    password:  dbConfig.password || process.env.RDS_PASSWORD ,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname + `/../**/*.entity.{js,ts}`], // entity 인식 못할수도 있어 직접 입력해준것
    synchronize : dbConfig.synchronize,

    timezone: 'Z' // 시간 세계협정시로 둠

    // Vultr 에 알맞은 놈으로 변환 필요
}


// npm build 는 db 쪽 건드리면 typescript 를 javascript 로 바꿔줌