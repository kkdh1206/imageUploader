import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ItemType, ItemStatus, ItemQuality, SoldItemStatus } from "./item-status.enum";
import { ItemImage } from "./item.Image";
import { User } from "src/auth/user.entity";
import { ItemComment } from "src/itemComment/itemComment.entity";

@Entity()
export class Item extends BaseEntity{
    @PrimaryGeneratedColumn() // /Item entity의 기본키임을 알려주기 위해 사용 
    id: number;

    @Column()
    title: string;  // 이름으로 검색 만듬

    @Column()
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; // 해당 열이 추가된 시각을 자동으로 기록합니다. 옵션을 적지 않을시 datetime 타입으로 기록됩니다.

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column()
    price: number;  // 가격대별 오름 or 내림차순 정렬 만들기

    @Column()
    status: ItemStatus;

    @Column()
    category: ItemType;

    @Column()
    quality: ItemQuality; 

    @Column()
    sold: Boolean;

    @Column()
    view: number;

    @Column()
    soldItemType: SoldItemStatus; 

    @OneToMany(type => ItemComment, comment => comment.item, {eager:true})
    comment: ItemComment[]

    @Column('simple-array')
    ImageUrls: Array<string>; // string으로 해야하지 itemImage 는 함수로 써야지 데이터타입이 될 수 가 없다.

    @ManyToOne(type => User, user=> user.items, {eager: false})
    @JoinColumn({name: 'userId'})
    user: User  // 내가 올린 물건 구현 완료

    // 이거 나중에 로그인 구현된거랑 합치면 유저별로 item과 이어주어서 내가 올린물건찾는기능 & 특정유저 올린물건 찾는기능 구현하기
}