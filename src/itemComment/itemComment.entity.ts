import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/user.entity'; 
import { Board } from 'src/boards/boards.entity';
import { Item } from 'src/item/item.entity';

@Entity()
export class ItemComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;  // 이걸로 저장된다 물론 위에 'created_at' 으로 데이터 베이스 에 표기는 된다.

  @ManyToOne(type => Item, item => item.comment, {eager:false})
  item:Item;
}