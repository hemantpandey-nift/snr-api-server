import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPost } from './schema/post.schema';
import { IUserPost } from './interface/post.interface';
import { Model, ObjectId } from 'mongoose';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { PostComment } from './schema/comment.schema';
import { IUserComment } from './interface/comment.interface';
import { GetPostCommentsDto } from './dto/get-post-comments.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(UserPost.name) private postModel: Model<IUserPost>,
    @InjectModel(PostComment.name) private commentModel: Model<IUserComment>,
  ) {}

  async createUserPost(createPostData: {
    postDescription: string;
    userId: string;
  }): Promise<IUserPost> {
    const newUser = await new this.postModel(createPostData);
    return newUser.save();
  }

  async addPostComment(createCommentData: {
    commentDescription: string;
    postId: ObjectId;
    userId: ObjectId;
  }): Promise<IUserComment> {
    const newUser = await new this.commentModel(createCommentData);
    return newUser.save();
  }

  async getPostById(id: ObjectId): Promise<IUserPost> {
    const postData = await this.postModel.findById(id);
    return postData;
  }

  async getAllPosts(getAllPostsDto: GetAllPostsDto): Promise<IUserPost[]> {
    const sortBy = getAllPostsDto?.sortBy ?? 'name';
    const sortOrder = getAllPostsDto?.order === 'desc' ? -1 : 1;
    const page: number = getAllPostsDto?.page
      ? Number(getAllPostsDto?.page)
      : 0;

    const limit: number = getAllPostsDto?.limit
      ? Number(getAllPostsDto?.limit)
      : 10;

    const skipData: number = page * limit;

    const postData = await this.postModel.aggregate([
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            // {
            //   $lookup: {
            //     from: 'users',
            //     foreignField: 'userId',
            //     localField: '_id',
            //     as: 'user',
            //   },
            // },
            {
              $match: {
                postDescription: { $regex: getAllPostsDto?.search ?? '' },
              },
            },
            { $sort: { [sortBy]: sortOrder } },
            { $skip: skipData },
            { $limit: limit },
            { $project: { __v: 0 } },
          ],
        },
      },
    ]);

    return postData;
  }

  async getPostComments(
    getPostCommentsDto: GetPostCommentsDto,
  ): Promise<IUserPost[]> {
    const sortBy = getPostCommentsDto?.sortBy ?? 'name';
    const sortOrder = getPostCommentsDto?.order === 'desc' ? -1 : 1;
    const page: number = getPostCommentsDto?.page
      ? Number(getPostCommentsDto?.page)
      : 0;

    const limit: number = getPostCommentsDto?.limit
      ? Number(getPostCommentsDto?.limit)
      : 10;

    const skipData: number = page * limit;

    const postData = await this.commentModel.aggregate([
      {
        $match: {
          postId: {
            $eq: getPostCommentsDto?.postId ?? '',
          },
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      { $project: { _id: 0, createdAt: 0, postId: 0, __v: 0 } },
      { $skip: skipData },
      { $limit: limit },
    ]);

    return postData;
  }
}
