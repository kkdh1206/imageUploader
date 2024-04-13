import { Injectable } from '@nestjs/common';
import { enumConvert } from './enum-convert';
import { DeclaresRepository } from './declare.repository';
import { UserRepository } from 'src/auth/user.repository';
import { CreateDeclareDto } from './DTO/create-declare.dto';
import { DeclareStatus } from './declare-status.enum';
import { Like, Not } from 'typeorm';
import { Declare } from './declare.entity';
import { User } from 'src/auth/user.entity';
import { create } from 'domain';
// import { Comment } from 'src/comment/comment.entity';

@Injectable()
export class DeclaresService {
    constructor(
        private declareRepository: DeclaresRepository,
        private convert: enumConvert,
        private userRepository: UserRepository
    ){}

    async getAllDelcares(page:number, pageSize:number): Promise<Declare[]|boolean>{
        const declares = await this.declareRepository.find({where: {status: Not(DeclareStatus.DELETED)}});
        return this.declareRepository.sortDeclares(declares, page, pageSize);
    }

    async getSearchDeclare(title: string, page:number, pageSize:number): Promise<Declare[]|boolean>{
        const declares = await this.declareRepository.find({
            where: {title : Like(`%${title}%`), 
                    status: DeclareStatus.PUBLIC}
        })
        return this.declareRepository.sortDeclares(declares, page, pageSize);
    }

    async countSearchDeclares(title:string):Promise<number>{
        let declares = await this.declareRepository.find({
                where:
                {
                    title : Like(`%${title}%`), 
                    status: Not(DeclareStatus.DELETED)
                }
        })
        return declares.length;
    }

    async countDeclares():Promise<number>{
        let declares;
        declares = await this.declareRepository.find({where: {status: Not(DeclareStatus.DELETED)}});
        
        return declares.length;
    }

    async getMyDeclare(user:User): Promise<Declare[]>{
        const declares = await user.declares;
        let realDeclares=[];
        for(let i=0; i<declares.length; i++){
            if(declares[i].status == DeclareStatus.DELETED){

            }else { realDeclares.push(declares[i]) }
        }
        realDeclares.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return 1;
            if (a.updatedAt > b.updatedAt) return -1;
            return 0;
          });

        await realDeclares;
        return realDeclares;
    }

    async createDeclare(createDeclareDto:CreateDeclareDto,user:User): Promise<Declare>{
        return this.declareRepository.createDeclare(createDeclareDto,user)
    }

    async getDeclareId(declareId:number):Promise<Declare>{ 
        const declare = await this.declareRepository
        .createQueryBuilder('declare')
        .leftJoinAndSelect('declare.user', 'user') // user칸을 붙여서 줌
        .where('declare.id = :declareId', {declareId})
        .getOne();
        return declare;
    }
    
    async patchMyDeclare(id:number, createDeclareDto: CreateDeclareDto):Promise<Declare>{
        const declare = await this.declareRepository.findOneBy({id});
        const {title, description, status} = createDeclareDto;
        let realstatus = this.convert.statusConvert(status);
        declare.title = title;
        declare.description = description;
        declare.status = realstatus;
        await this.declareRepository.save(declare);
        return declare;
    }

    async patchStatus(id:number, status:string): Promise<Declare>{
        const declare = await this.declareRepository.findOneBy({id});
        let realstatus = this.convert.statusConvert(status);
        declare.status = realstatus;
        await this.declareRepository.save(declare);
        return declare;
    }

    // async getComment(id:number):Promise<Comment[]>{
    //     const board = await this.boardRepository.findOneBy({id});
    //     return board.comment;
    // }
}
