import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly username: string;
  readonly password: string;
  readonly userEmail: string;
  readonly isLogged: boolean;
  readonly lastLoggedAt: Date;
}
