import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/login.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { UserEntity } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async signIn({ id, email }) {
    const accessToken = await this.jwtService.signAsync({
      id,
      email,
    });

    const user = await this.userService.findById(id);

    const result = plainToInstance(UserEntity, { ...user, token: accessToken });

    return result;
  }
}