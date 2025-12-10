import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/modules/user/user.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Login failed', {
        description: 'Not found user with this email',
      });
    }

    const isPasswordValid = await this.userService.checkPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Login failed', {
        description: 'Password is incorrect',
      });
    }
    return user; //Return cái gì --> cái đó sẽ được chuyển qua cho AuthGuard rồi gán vào req.user
  }
}