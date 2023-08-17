import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { BoardRepository } from './boards.repository';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { enumConvert } from './enum-convert';
import { BoardPaginationService } from './pagination.service';
import { UserRepository } from 'src/auth/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';

@Module({
  imports:[
    TypeOrmExModule.forCustomRepository([BoardRepository,UserRepository]),
    TypeOrmModule.forFeature([Board]),
    AuthModule
  ],

  controllers: [BoardsController],
  providers: [BoardsService, enumConvert, BoardPaginationService]
})
export class BoardsModule {}
