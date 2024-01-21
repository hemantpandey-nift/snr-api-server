import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.schema';
import { GetAllUsersDto } from './dto/get-all-user.dto';
import { encryptPassword } from '../auth/utils/auth.helper';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const encryptedText = await encryptPassword({
      valueToEncrypt: createUserDto.password,
    });

    createUserDto.password = encryptedText;

    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async getAllUsers(getAllUsersDto: GetAllUsersDto): Promise<IUser[]> {
    const sortBy = getAllUsersDto?.sortBy ?? 'name';
    const sortOrder = getAllUsersDto?.order === 'desc' ? -1 : 1;
    const page: number = getAllUsersDto?.page
      ? Number(getAllUsersDto?.page)
      : 0;

    const limit: number = getAllUsersDto?.limit
      ? Number(getAllUsersDto?.limit)
      : 10;

    const skipData: number = page * limit;

    const userData = await this.userModel.aggregate([
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            {
              $match: {
                $or: [{ username: { $regex: getAllUsersDto?.search ?? '' } }],
              },
            },
            { $sort: { [sortBy]: sortOrder } },
            { $skip: skipData },
            { $limit: limit },
          ],
        },
      },
    ]);

    return userData;
  }

  async getUserData(userEmail: string): Promise<IUser> {
    const userData = await this.userModel.findOne({
      userEmail: { $regex: userEmail ?? '' },
    });
    return userData;
  }

  async getUserById(id: string): Promise<IUser> {
    const userData = await this.userModel.findById(id);
    return userData;
  }

  async updateLoginState({
    id,
    loginState,
  }: {
    id: string;
    loginState: boolean;
  }) {
    await this.userModel.updateOne(
      { _id: id },
      { isLogged: loginState, lastLoggedAt: new Date() },
    );
  }
}
