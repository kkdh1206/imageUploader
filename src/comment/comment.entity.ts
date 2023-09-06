import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/user.entity'; 
import { Board } from 'src/boards/boards.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;  // 이걸로 저장된다 물론 위에 'created_at' 으로 데이터 베이스 에 표기는 된다.

  @ManyToOne(type => Board, board => board.comment, {eager:false})
  board:Board;
}