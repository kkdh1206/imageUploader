import { BoardStatus } from "./board-status.enum"

export class enumConvert{
    statusConvert(status:string){
        if(status == 'PUBLIC'){
            return BoardStatus.PUBLIC
        }
        if(status == 'PRIVATE'){
            return BoardStatus.PRIVATE
        }
        if(status == 'DELETED'){
            return BoardStatus.DELETED
        }
       
    }
}