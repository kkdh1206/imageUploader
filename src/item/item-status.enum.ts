export enum ItemStatus { // 데이터 타입
    RESERVED = "RESERVED",
    USERFASTSELL ='USERFASTSELL',
    SUPOFASTSELL = 'SUPOFASTSELL',
    SOLDOUT = 'SOLDOUT',
    TRADING = 'TRADING',  // 근데 이거 택스트의 의미는 무엇이고 어디 쓰이는가???
    DELETED = 'DELETED',
}

export enum ItemType{
    BOOK = 'BOOK',
    CLOTHES = 'CLOTHES',
    REFRIGERATOR = 'REFRIGERATOR',
    MONITOR = 'MONITOR',
    ROOM = 'ROOM',
    ETC = 'ETC',
    HELP ='HELP'
}

// export enum SortType{
//     // PRICEASCEND = 'PRICEASCEND',
//     // PRICEDESCEND = 'PRICEDESCEND',
//     // DATEASCEND = 'DATEASCEND',
//     // DATEDESCEND = 'DATEDESCEND',
// }

export enum ItemQuality{
    HIGH ='HIGH',
    MID = 'MID',
    LOW = 'LOW',
    NONE = 'NONE'
}

export enum SoldItemStatus{
    VISIBLE = "VISIBLE",
    INVISIBLE ="INVISIBLE"
}