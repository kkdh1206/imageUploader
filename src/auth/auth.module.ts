import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';


@Module({
    imports:[ 
      TypeOrmExModule.forCustomRepository([UserRepository]) // 생성된 UserRepository를 다른곳에서 사용하기위해
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtService],// 현재 JwtStragety를 Auth 모듈에서 사용하게위해 넣음
    exports:[JwtAuthGuard, AuthService] // 이건 다른 모듈에서 사용하기위해 넣어줌
  })
export class AuthModule {}