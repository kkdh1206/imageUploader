import { Item } from "src/item/item.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserGrade, UserStatus } from "./user-status.enum";
import { Board } from "src/boards/boards.entity";

@Entity()
@Unique(['Email']) // 같은 username 혹은 Email 사용하면 오류 뜨게됨   --> 이 방법 말고도 findOne 함수로 entity에 존재하는지 확인해서 에러주는 방법도 있다.
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
    online: boolean;

    @Column()
    userGrade: UserGrade; // 유저 학점

    @Column()
    userScore: number; // 유저 점수 -> 이걸 기반으로 + - 되서 점수를 합산해 등급을 결정

    @Column()
    userstatus: UserStatus;

    @Column('simple-array')
    alarmList: Array<string>

    @Column('simple-array')
    interestedId : Array<number>  

    @OneToMany(type => Item, item => item.user, {eager:true})
    items: Item[]

    @OneToMany(type => Board, board => board.user, {eager: true})
    boards: Board[]

   

}