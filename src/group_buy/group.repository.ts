import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Group } from "./group.entity";
import { Repository } from "typeorm";
import { GroupPaginationService } from "./pagination.service";
import { enumConvert } from "./enum-convert";
import { CreateGroupDto } from "./DTO/create-group.dto";
import { User } from "src/auth/user.entity";
import { GroupStatus } from "./group-status.enum";


@CustomRepository(Group)
export class GroupsRepository extends Repository<Group> {

    private groupPaginationService:GroupPaginationService;
    private convert: enumConvert
    
    initializeDependencies(){
        this.groupPaginationService = new GroupPaginationService();
        this.convert = new enumConvert();
    }  


    async createGroup(createGroupDto: CreateGroupDto,user: User, images: Array<string>):Promise<Group>{
        this.initializeDependencies();
        const {title, description, address, price, oldprice} = createGroupDto;
        const group = this.create({ 
            title,
            description,
            status: GroupStatus.RECRUITING, 
            user: user,
            address: address,
            price: price,
            oldprice : oldprice,
            ImageUrls: images
         })
        await this.save(group);
        return group;
    }




    async sortGroups(declares:Group[], page:number, pageSize:number): Promise<Group[]|boolean>{
        this.initializeDependencies();
        declares.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return 1;
            if (a.updatedAt > b.updatedAt) return -1;
            return 0;
        });
        let realDeclares = await declares;
        return this.groupPaginationService.getPaginatedGroups(page,pageSize,realDeclares);
    }
}