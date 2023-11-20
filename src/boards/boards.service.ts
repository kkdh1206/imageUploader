import { Injectable } from '@nestjs/common';
import { enumConvert } from './enum-convert';
import { BoardRepository } from './boards.repository';
import { UserRepository } from 'src/auth/user.repository';
import { CreateBoardmDto } from './DTO/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { Like, Not } from 'typeorm';
import { Board } from './boards.entity';
import { User } from 'src/auth/user.entity';
import { create } from 'domain';
import { Comment } from 'src/comment/comment.entity';

@Injectable()
export class BoardsService {
    constructor(
        private boardRepository: BoardRepository,
        private convert: enumConvert,
        private userRepository: UserRepository
    ){}

    async getAllBoards(page:number, pageSize:number): Promise<Board[]|boolean>{
        const boards = await this.boardRepository.find({where: {status: Not(BoardStatus.DELETED)}});
        return this.boardRepository.sortBoards(boards, page, pageSize);
    }

    async getSearchedBoard(title: string, page:number, pageSize:number): Promise<Board[]|boolean>{
        const boards = await this.boardRepository.find({
            where: {title : Like(`%${title}%`), 
                    status: BoardStatus.PUBLIC}
        })
        return this.boardRepository.sortBoards(boards, page, pageSize);
    }

    async countSearchBoards(title:string):Promise<number>{
        let boards = await this.boardRepository.find({
                where:
                {
                    title : Like(`%${title}%`), 
                    status: Not(BoardStatus.DELETED)
                }
        })
        return boards.length;
    }

    async countBoards():Promise<number>{
        let boards;
        boards = await this.boardRepository.find({where: {status: Not(BoardStatus.DELETED)}});
        
        return boards.length;
    }

    async getMyBoards(user:User): Promise<Board[]>{
        const boards = await user.boards;
        let realBoards=[];
        for(let i=0; i<boards.length; i++){
            if(boards[i].status == BoardStatus.DELETED){

            }else { realBoards.push(boards[i]) }
        }
        realBoards.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return 1;
            if (a.updatedAt > b.updatedAt) return -1;
            return 0;
          });

        await realBoards;
        return realBoards;
    }

    async createBoard(createBoardDto:CreateBoardmDto,user:User): Promise<Board>{
        return this.boardRepository.createBoard(createBoardDto,user)
    }

    async getBoardId(boardId:number):Promise<Board>{ 
        const board = await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user') // user칸을 붙여서 줌
        .where('board.id = :boardId', {boardId})
        .getOne();
        return board;
    }
    
    async patchMyBoard(id:number, createBoardDto: CreateBoardmDto):Promise<Board>{
        const board = await this.boardRepository.findOneBy({id});
        const {title, description, status} = createBoardDto;
        let realstatus = this.convert.statusConvert(status);
        board.title = title;
        board.description = description;
        board.status = realstatus;
        await this.boardRepository.save(board);
        return board;
    }

    async patchStatus(id:number, status:string): Promise<Board>{
        const board = await this.boardRepository.findOneBy({id});
        let realstatus = this.convert.statusConvert(status);
        board.status = realstatus;
        await this.boardRepository.save(board);
        return board;
    }

    async getComment(id:number):Promise<Comment[]>{
        const board = await this.boardRepository.findOneBy({id});
        return board.comment;
    }
}
