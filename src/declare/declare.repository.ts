import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { Declare } from "./declare.entity";
import { Repository } from "typeorm";
import { DeclarePaginationService } from "./pagination.service";
import { enumConvert } from "./enum-convert";
import { CreateDeclareDto } from "./DTO/create-declare.dto";
import { User } from "src/auth/user.entity";


@CustomRepository(Declare)
export class DeclaresRepository extends Repository<Declare> {

    private declarePaginationService: DeclarePaginationService;
    private convert: enumConvert
    
    initializeDependencies(){
        this.declarePaginationService = new DeclarePaginationService();
        this.convert = new enumConvert();
    }  


    async createDeclare(createBoardDto: CreateDeclareDto,user: User):Promise<Declare>{
        this.initializeDependencies();
        const {title, description, status} = createBoardDto;
        let realstatus = this.convert.statusConvert(status);
        const board = this.create({ 
            title,
            description,
            status: realstatus, 
            user: user
         })
        await this.save(board);
        return board;
    }



    async sortDeclares(declares:Declare[], page:number, pageSize:number): Promise<Declare[]|boolean>{
        this.initializeDependencies();
        declares.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return 1;
            if (a.updatedAt > b.updatedAt) return -1;
            return 0;
        });
        let realDeclares = await declares;
        return this.declarePaginationService.getPaginatedDeclares(page,pageSize,realDeclares);
    }
}