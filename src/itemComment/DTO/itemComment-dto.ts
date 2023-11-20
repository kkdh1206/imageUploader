import { IsNotEmpty, IsString } from 'class-validator';

export class ItemCreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  itemId: number;
}