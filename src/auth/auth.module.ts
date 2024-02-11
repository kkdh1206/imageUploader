import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtAuthGuard2 } from './jwt-auth.guard2';
import { UserImage } from './user.image';
import { HttpModule } from '@nestjs/axios';
import { ItemRepository } from 'src/item/item.repository';


@Module({
    imports:[ 
      TypeOrmExModule.forCustomRepository([UserRepository]), HttpModule // 여기에 ItemRepository 까지 import 하면 itemRepository 에서도 userRepository 를 import해서 서로가 참조해서 데이터 베이스 오류가난다 (eager:true 쌍방 오류)
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtService, JwtAuthGuard2, UserImage],// 현재 JwtStragety를 Auth 모듈에서 사용하게위해 넣음
    exports:[JwtAuthGuard, AuthService] // 이건 다른 모듈에서 사용하기위해 넣어줌    따라서 JwtAuthGuard2 는 다른곳에서 못씀
  })
export class AuthModule {}
