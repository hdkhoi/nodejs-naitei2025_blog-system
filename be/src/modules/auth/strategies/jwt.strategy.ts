import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from 'src/common/interfaces/IJwtPayload';

@Injectable()
//JWT Strategy sẽ dùng để xác thực các token gửi lên từ client
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      //Extract token từ header "Authorization: Bearer xxx"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Verify signature với secret key
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  validate(payload: IJwtPayload) {
    return { id: payload.id, email: payload.email }; //trả về lại cho AuthGuard để xử lý tiếp
  }
}