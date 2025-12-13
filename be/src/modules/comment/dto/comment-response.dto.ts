import { Expose } from 'class-transformer';
import { UserBasicDto } from 'src/modules/user/dto/user-response.dto';

export class CommentDto {
  @Expose()
  body: string;
  @Expose()
  author: UserBasicDto;
  @Expose()
  createdAt: Date;
  @Expose()
  replies: CommentDto[];
}
