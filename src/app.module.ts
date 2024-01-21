import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PostModule } from './post/post.module';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { UserPost, UserPostSchema } from './post/schema/post.schema';
import { PostComment, PostCommentSchema } from './post/schema/comment.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    MongooseModule.forRoot(process.env.DATABASE),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserPost.name, schema: UserPostSchema },
      { name: PostComment.name, schema: PostCommentSchema },
    ]),
    AuthModule,
    PostModule,
  ],
  controllers: [UserController, AuthController, PostController],
  providers: [UserService, AuthService, JwtService, PostService],
})
export class AppModule {}
