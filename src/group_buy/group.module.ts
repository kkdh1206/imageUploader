import { Module } from '@nestjs/common';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { GroupsRepository } from './group.repository';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { enumConvert } from './enum-convert';
import { GroupPaginationService } from './pagination.service';
import { UserRepository } from 'src/auth/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupImage } from './group.Image';

@Module({
  imports:[
    TypeOrmExModule.forCustomRepository([GroupsRepository,UserRepository]),
    TypeOrmModule.forFeature([Group]),
    HttpModule,
    AuthModule
  ],

  controllers: [GroupsController],
  providers: [GroupsService, enumConvert, GroupPaginationService, GroupImage],
})
export class GroupModule {}
