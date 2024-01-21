import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUsersDto } from './dto/get-all-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //create new user
  @Post('register')
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newuser = await this.userService.createUser(createUserDto);
      return response.status(200).json({
        staus: false,
        message: 'User Successfully created',
        data: newuser,
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'Failed to add user',
      });
    }
  }

  //get all users
  @UseGuards(AuthGuard)
  @Get('all-users')
  async getAllUsers(@Res() response, @Query() getAllUsersDto: GetAllUsersDto) {
    try {
      const allUsers: any = await this.userService.getAllUsers(getAllUsersDto);

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
}
