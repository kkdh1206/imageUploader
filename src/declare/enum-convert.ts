import { DeclareStatus } from "./declare-status.enum"

export class enumConvert{
    statusConvert(status:string){
        if(status == 'PUBLIC'){
            return DeclareStatus.PUBLIC
        }
        if(status == 'COMPLETED'){
            return DeclareStatus.COMPLETED
        }
        if(status == 'DELETED'){
            return DeclareStatus.DELETED
        }
       
    }
}