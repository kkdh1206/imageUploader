import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ItemStatus } from "../item-status.enum";


export class ItemStateValidationPipe implements PipeTransform{
    readonly StatusOptions =[
        ItemStatus.USERFASTSELL,
        ItemStatus.SUPOFASTSELL,
        ItemStatus.SOLDOUT,
        ItemStatus.TRADING,
        ItemStatus.RESERVED,
        ItemStatus.DELETED,
    ]

    transform(value: any) {
        value = value.toUpperCase(); // 대소문자 통일해줌

        if (!this.isStatusValid(value)){
            throw new BadRequestException(`${value} isn't in the status options`)
        }

        // if (this.isAdminValid(value)){
        //     if(){// Admin 이 아니라면
        //         throw new BadRequestException(`${value} isn't in the status options`)
        //     }
        // }
        return value;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1 // -1 이라는 말은 여기 index에 없다는 뜻
    }

    // private isAdminValid(status: any){
    //     const index = this.StatusOptions.indexOf(status);
    //     return index !== 0 // 급처분 기능 제한
    // }
}