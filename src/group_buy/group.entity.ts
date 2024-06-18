import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupStatus } from "./group-status.enum";
import { User } from "src/auth/user.entity";
import { Comment } from "src/comment/comment.entity";

@Entity()
export class Group extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: GroupStatus;

    @Column()
    address: string;

    @Column()
    price : number;

    @Column()
    oldprice : number;

    @Column('simple-array')
    ImageUrls: Array<string>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; 

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, user => user.groups, {eager: false})
    user: User;


    
}