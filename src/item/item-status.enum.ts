export enum ItemStatus { // 데이터 타입
    RESERVED = "RESERVED",
    FASTSELL ='FASTSELL',
    SOLDOUT = 'SOLDOUT',
    TRADING = 'TRADING'  // 근데 이거 택스트의 의미는 무엇이고 어디 쓰이는가???
}

export enum ItemCategory{
    BOOK = 'BOOK',
    CLOTHES = 'CLOTHES',
    REFRIGERATOR = 'REFRIGERATOR',
    ETC = 'ETC'
}

export enum SortType{
    'PRICEASCEND' = 'PRICEASCEND',
    'PRICEDESCEND' = 'PRICEDESCEND',
    'DATEASCEND' = 'DATEASCEND',
    'DATEDESCEND' = 'DATEDESCEND',
}