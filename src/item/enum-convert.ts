import { ItemQuality, ItemStatus, ItemType } from "./item-status.enum"

export class enumConvert{
    categoryConvert(category:string){
        if(category == 'BOOK'){
            return ItemType.BOOK
        }
        if(category == 'CLOTHES'){
            return ItemType.CLOTHES
        }
        if(category == 'REFRIGERATOR'){
            return ItemType.REFRIGERATOR
        }
        if(category == 'MONITOR'){
            return ItemType.MONITOR
        }
        if(category == 'ROOM'){
            return ItemType.ROOM
        }
        if(category == 'ETC'){
            return ItemType.ETC
        }

    }
    
    statusConvert(status: string){
        if(status == 'RESERVED'){
            return ItemStatus.RESERVED
        }
        if(status == 'USERFASTSELL'){ // 유저가 올림  --->  관리자 페이지에서 뜨게 만들 예정
            return ItemStatus.USERFASTSELL
        }
        if(status == 'SUPOFASTSELL'){ // 우리가 올림  ---> 일반 유저가 다 볼 수 있게 올라올 예정
            return ItemStatus.SUPOFASTSELL
        }
        if(status == 'SOLDOUT'){
            return ItemStatus.SOLDOUT
        }
        if(status == 'TRADING'){
            return ItemStatus.TRADING
        }
        if(status == 'DELETED'){
            return ItemStatus.DELETED
        }
    }

    qualityConvert(quality: string){
        if(quality == 'HIGH'){
            return ItemQuality.HIGH
        }
        if(quality == 'MID'){
            return ItemQuality.MID
        }
        if(quality == 'LOW'){
            return ItemQuality.LOW
        }
    }
    
}