import { Expose, Transform, Type } from 'class-transformer';
import { ArticleStatus } from 'src/common/class/enum/article.enum';
import { CommentDto } from 'src/modules/comment/dto/comment-response.dto';
import { TagEntity } from 'src/modules/tag/entities/tag.entity';
import { UserBasicDto } from 'src/modules/user/dto/user-response.dto';

export class ArticleListItemDto {
  @Expose()
  title: string;
  @Expose()
  slug: string;
  @Expose()
  description: string;
  @Expose()
  status: ArticleStatus;
  @Expose()
  cover_image: string;
  @Expose()
  published_at?: Date;
  @Expose()
  views: number;
  @Expose()
  reading_time: number;
  @Expose()
  favoriteCount: number;
  @Expose()
  commentCount: number;
  @Expose()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [];
    return value.map((tag: TagEntity) => tag.name);
  })
  tagList: TagEntity[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  @Type(() => UserBasicDto)
  author: UserBasicDto;
}

export class ArticleDetailDto extends ArticleListItemDto {
  @Expose()
  body: string;
  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];
  @Expose()
  favorited: boolean;
  @Expose()
  @Type(() => UserBasicDto)
  favoritedBy: UserBasicDto[];
}
