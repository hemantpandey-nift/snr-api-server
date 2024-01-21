import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ObjectId } from 'mongoose';
import { GetPostCommentsDto } from './dto/get-post-comments.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private usersService: UserService,
  ) {}

  //create new post
  @UseGuards(AuthGuard)
  @Post('create')
  async createUserPost(
    @Res() response,
    @Req() request,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      const userId: string = request.user.sub;
      //   const userData = await this.usersService.getUserById(userId);

      const createPostData: {
        postDescription: string;
        userId: string;
      } = {
        postDescription: createPostDto.postDescription,
        userId,
      };

      const newPost = await this.postService.createUserPost(createPostData);
      return response.status(200).json({
        staus: false,
        message: 'Successfully created post',
        data: newPost,
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'Failed to create post',
      });
    }
  }

  //get all users
  @UseGuards(AuthGuard)
  @Get('all')
  async getAllPosts(@Res() response, @Query() getAllPostsDto: GetAllPostsDto) {
    try {
      const allUsers: any = await this.postService.getAllPosts(getAllPostsDto);

      return response.status(200).json({
        status: true,
        message: 'Successfully fetched user data',
        data: allUsers[0].data,
        totalRecords: allUsers[0].metadata[0].total,
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'Failed to fetch user data',
      });
    }
  }

  //create new comment
  @UseGuards(AuthGuard)
  @Post('add-comment')
  async addPostComment(
    @Res() response,
    @Req() request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      const userId: ObjectId = request.user.sub;
      const postData = await this.postService.getPostById(
        createCommentDto.postId,
      );

      if (!postData) {
        return response.status(400).json({
          status: false,
          message: 'Invalid post id',
        });
      }
      const createCommentData: {
        commentDescription: string;
        postId: ObjectId;
        userId: ObjectId;
      } = {
        commentDescription: createCommentDto.commentDescription,
        postId: createCommentDto.postId,
        userId,
      };

      const newPost = await this.postService.addPostComment(createCommentData);
      return response.status(200).json({
        staus: false,
        message: 'Successfully created post',
        data: newPost,
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'Failed to create post',
      });
    }
  }

  //create new comment
  @UseGuards(AuthGuard)
  @Get('get-comment')
  async getPostComment(
    @Res() response,
    @Req() request,
    @Query() getPostCommentsDto: GetPostCommentsDto,
  ) {
    try {
      const postData = await this.postService.getPostById(
        getPostCommentsDto.postId,
      );

      if (!postData) {
        return response.status(400).json({
          status: false,
          message: 'Invalid post id',
        });
      }
      const allPostComments =
        await this.postService.getPostComments(getPostCommentsDto);

      return response.status(200).json({
        staus: false,
        message: 'Successfully fetched post comments',
        data: { post: postData.postDescription, comments: allPostComments },
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'Failed to create post',
      });
    }
  }
}
