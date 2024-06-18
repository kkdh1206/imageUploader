import { Injectable } from '@nestjs/common';
import { enumConvert } from './enum-convert';
import { GroupsRepository } from './group.repository';
import { UserRepository } from 'src/auth/user.repository';
import { CreateGroupDto } from './DTO/create-group.dto';
import { GroupStatus } from './group-status.enum';
import { Like, Not } from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/auth/user.entity';
import { create } from 'domain';

@Injectable()
export class GroupsService {
    constructor(
        private groupRepository: GroupsRepository,
        private convert: enumConvert,
        private userRepository: UserRepository
    ){}

    async getAllgroups(page:number, pageSize:number): Promise<Group[]|boolean>{
        const groups = await this.groupRepository.find({where: {status: Not(GroupStatus.DELETED)}});
        return this.groupRepository.sortGroups(groups, page, pageSize);
    }

    async getSearchGroup(title: string, page:number, pageSize:number): Promise<Group[]|boolean>{
        const groups = await this.groupRepository.find({
            where: {title : Like(`%${title}%`), 
                    status: GroupStatus.DELETED}
        })
        return this.groupRepository.sortGroups(groups, page, pageSize);
    }

    async countSearchGroups(title:string):Promise<number>{
        let groups = await this.groupRepository.find({
                where:
                {
                    title : Like(`%${title}%`), 
                    status: Not(GroupStatus.DELETED)
                }
        })
        return groups.length;
    }

    async countGroups():Promise<number>{
        let groups;
        groups = await this.groupRepository.find({where: {status: Not(GroupStatus.DELETED)}});
        
        return groups.length;
    }

    async getMyGroups(user:User): Promise<Group[]>{
        const groups = await user.groups;
        let realGroups=[];
        for(let i=0; i<groups.length; i++){
            if(groups[i].status == GroupStatus.DELETED){

            }else { realGroups.push(groups[i]) }
        }
        realGroups.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return 1;
            if (a.updatedAt > b.updatedAt) return -1;
            return 0;
          });

        await realGroups;
        return realGroups;
    }

    async createGroup(createGroupDto:CreateGroupDto,user:User, images: Array<string>): Promise<Group>{
        return this.groupRepository.createGroup(createGroupDto,user, images)
    }

    async getGroupId(groupId:number):Promise<Group>{ 
        const group = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.user', 'user') // user칸을 붙여서 줌
        .where('group.id = :groupId', {groupId})
        .getOne();
        return group;
    }
    
    async patchMyGroup(id:number, createGroupDto: CreateGroupDto, status:string, images: Array<string>):Promise<Group>{
        const group = await this.groupRepository.findOneBy({id});
        const {title, description, price, address, oldprice} = createGroupDto;
        let realstatus = this.convert.statusConvert(status);
        group.title = title;
        group.description = description;
        group.status = realstatus;
        group.address = address;
        group.price = price;
        group.oldprice = oldprice;
        group.ImageUrls = images;
        await this.groupRepository.save(group);
        return group;
    }

    async addInterestedGroup ( id: number, user:User ):Promise<User> {
        const currentUser = await this.userRepository.findOne({where:{uid: user.uid}})
        currentUser.interestedGroupId.push(id)
        this.userRepository.save(currentUser);
        return currentUser
    }

    async deleteInterestedGroup ( id: number, user:User ):Promise<User> {
        const currentUser = await this.userRepository.findOne({where:{uid: user.uid}})
        currentUser.interestedGroupId = currentUser.interestedGroupId.filter((num) => num !== id)
        await this.userRepository.save(currentUser);
        return currentUser
    }


    async patchStatus(id:number, status:string): Promise<Group>{
        const group = await this.groupRepository.findOneBy({id});
        let realstatus = this.convert.statusConvert(status);
        group.status = realstatus;
        await this.groupRepository.save(group);
        return group;
    }

    // async getComment(id:number):Promise<Comment[]>{
    //     const board = await this.boardRepository.findOneBy({id});
    //     return board.comment;
    // }
}
