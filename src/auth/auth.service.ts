import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { comparePassword } from 'src/auth/utils/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(userLoginDto: UserLoginDto) {
    const userData = await this.usersService.getUserData(
      userLoginDto.userEmail,
    );

    if (!userData) {
      throw new UnauthorizedException();
    }

    const loginPassword: string = userLoginDto?.password;
    const userPassword: any = userData?.password;
    const passwordCompared = await comparePassword({
      loginPassword,
      userPassword,
    });

    if (!passwordCompared) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: userData._id,
      userName: userData.username,
      userEmail: userData.userEmail,
      iss: 'hemant-pandey',
      token_use: 'access',
      auth_time: Date.now(),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_ACCESS_TOKEN,
    });

    await this.usersService.updateLoginState({
      id: userData._id,
      loginState: true,
    });

    return accessToken;
  }

  async signOut(id: string) {
    await this.usersService.updateLoginState({
      id: id,
      loginState: false,
    });
  }
}
