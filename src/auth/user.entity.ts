import { Item } from "src/item/item.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserGrade, UserStatus } from "./user-status.enum";
import { Board } from "src/boards/boards.entity";
import { Declare } from "src/declare/declare.entity";
import { Group } from "src/group_buy/group.entity";

@Entity()
// @Unique(['Email']) // 같은 Email 사용하면 오류 뜨게됨   --> 이 방법 말고도 findOne 함수로 entity에 존재하는지 확인해서 에러주는 방법도 있다.
export class User extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Email: string;

    @Column()//{unique:true}
    username: string;    // 처음에 username 도 설정 받아와야함 플러터에서

    @Column()
    realname: string;

    @Column()
    studentNumber: string;

    @Column()
    imageUrl: string;

    @Column()
    FCM_token: string;

    @Column()
    uid: string;

    @Column()
    chatAlarm: boolean;

    @Column()
    categoryAlarm: boolean;

    @Column()
    online: boolean;

    @Column()
    userGrade: UserGrade; // 유저 학점

    @Column()
    userScore: number; // 유저 점수 -> 이걸 기반으로 + - 되서 점수를 합산해 등급을 결정

    @Column()
    userstatus: UserStatus;


    // @Column('simple-array', {nullable: false}) // 여기서 구매 내역이 맞는 건지 확인하는 아이템과 유저 아이디를 묶은 클래스를 리스트 요소로 가짐
    // requests: Array<Request>// --> 기본 타입이 아닌 경우는 Entity 만 <> 안에 들어갈 수 있다

    @Column('simple-array') // 여기서 구매 내역이 맞는 건지 확인하는 아이템과 유저 아이디를 묶은 클래스를 리스트 요소로 가짐
    requests: Array<string>

    @Column('simple-array',{nullable : true})
    history: Array<number>

    @Column('simple-array')
    alarmList: Array<string>

    @Column('simple-array')
    interestedId : Array<number>
    
    @Column('simple-array')
    interestedGroupId : Array<number>

    @Column('simple-array')
    hatedId : Array<number> 

    @OneToMany(type => Item, item => item.user, {eager:true})
    items: Item[]

    @OneToMany(type => Board, board => board.user, {eager: true})
    boards: Board[]

    @OneToMany(type => Declare, declare => declare.user, {eager: true})
    declares: Declare[]

    @OneToMany(type => Group, group => group.user, {eager: true})
    groups: Group[]
   

}