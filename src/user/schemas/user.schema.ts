import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import validator from 'validator';

@Schema()
export class User {
  @Prop({
    required: [true, 'User name is required'],
    minlength: [2, 'User name should contain atleast 2 characters'],
    maxlength: [150, 'User name can contain maximum 150 characters'],
  })
  username: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: [4, 'Password should contain atleast 4 characters'],
  })
  password: string;

  @Prop({
    required: [true, 'User email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  })
  userEmail: string;

  @Prop({
    default: false,
  })
  isLogged: boolean;

  @Prop({
    required: false,
  })
  lastLoggedAt: Date;

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
