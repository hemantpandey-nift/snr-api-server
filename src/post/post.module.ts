import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPost, UserPostSchema } from './schema/post.schema';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { PostComment, PostCommentSchema } from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPost.name, schema: UserPostSchema },
      { name: User.name, schema: UserSchema },
      { name: PostComment.name, schema: PostCommentSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, UserService],
})
export class PostModule {}
