import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DeclareStatus } from "./declare-status.enum";
import { User } from "src/auth/user.entity";
import { Comment } from "src/comment/comment.entity";

@Entity()
export class Declare extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: DeclareStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; 

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, user => user.declares, {eager: false})
    user: User;

    // @OneToMany(type => Comment, comment => comment.board, {eager:true})
    // comment: Comment[]

    
}