import { Module } from '@nestjs/common';
import { DeclaresController } from './declare.controller';
import { DeclaresService } from './declare.service';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { DeclaresRepository } from './declare.repository';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { enumConvert } from './enum-convert';
import { DeclarePaginationService } from './pagination.service';
import { UserRepository } from 'src/auth/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Declare } from './declare.entity';

@Module({
  imports:[
    TypeOrmExModule.forCustomRepository([DeclaresRepository,UserRepository]),
    TypeOrmModule.forFeature([Declare]),
    AuthModule
  ],

  controllers: [DeclaresController],
  providers: [DeclaresService, enumConvert, DeclarePaginationService]
})
export class DeclaresModule {}
