import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ItemCategory, ItemStatus } from "./item-status.enum";
import { ItemImage } from "./item.Image";
import { User } from "src/auth/user.entity";

@Entity()
export class Item extends BaseEntity{
    @PrimaryGeneratedColumn() // /Item entity의 기본키임을 알려주기 위해 사용 
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; // 해당 열이 추가된 시각을 자동으로 기록합니다. 옵션을 적지 않을시 datetime 타입으로 기록됩니다.

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column()
    price: number;

    @Column()
    status: ItemStatus;

    @Column()
    category: ItemCategory;

    @Column('simple-array')
    ImageUrls: Array<string>; // string으로 해야하지 itemImage 는 함수로 써야지 데이터타입이 될 수 가 없다.

    @ManyToOne(type => User, user=> user.items, {eager: false})
    user: User

    // 이거 나중에 로그인 구현된거랑 합치면 유저별로 item과 이어주어서 내가 올린물건찾는기능 & 특정유저 올린물건 찾는기능 구현하기
}