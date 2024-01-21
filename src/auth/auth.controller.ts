import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // user Login
  @Post('login')
  async userLogin(@Res() response, @Body() userLoginDto: UserLoginDto) {
    try {
      const accessToken = await this.authService.signIn(userLoginDto);

      return response.status(200).json({
        status: true,
        message: 'User successfully logged in',
        accessToken: accessToken,
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'User login failed',
      });
    }
  }

  // user Logout
  @UseGuards(AuthGuard)
  @Post('logout')
  async userLogout(@Res() response, @Req() request) {
    try {
      const userId: string = request.user.sub;
      const accessToken = await this.authService.signOut(userId);

      return response.status(200).json({
        status: true,
        message: 'User successfully signed out',
        accessToken: accessToken,
      });
    } catch (error) {
      console.log('error:', error);
      return response.status(400).json({
        status: false,
        message: error?.message ?? 'User logout failed',
      });
    }
  }
}
