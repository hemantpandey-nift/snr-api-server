import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';

const User = mongoose.model('User', UserSchema);

@Schema()
export class UserPost {
  @Prop({
    required: [true, 'Post description is required'],
    minlength: [5, 'Post description should contain atleast 2 characters'],
    maxlength: [1000, 'Post description can contain maximum 1000 characters'],
  })
  postDescription: string;

  @Prop({ type: Types.ObjectId, ref: () => User })
  userId;

  // @Prop({
  //   required: [true, 'User id is required'],
  //   type: Schema.Types.ObjectId,
  // })
  // userId: [{ type: Schema.Types.ObjectId; ref: 'User' }];

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;
}
export const UserPostSchema = SchemaFactory.createForClass(UserPost);
