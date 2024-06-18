import { GroupStatus }  from "./group-status.enum"

export class enumConvert{
    statusConvert(status:string){
        if(status == 'RECRUITING'){
            return GroupStatus.RECRUITING
        }
        if(status == 'PROCEEDING'){
            return GroupStatus.PROCEEDING
        }
        if(status == 'COMPLETED'){
            return GroupStatus.COMPLETED
        }
        if(status == 'DELETED'){
            return GroupStatus.DELETED
        }
       
    }
}
