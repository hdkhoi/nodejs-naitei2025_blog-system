import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user) {
      const message = 'Unauthorized';
      if (info) {
        const exception = {
          JsonWebTokenError: 'Invalid token',
          TokenExpiredError: 'Token expired',
          Error: 'No token provided',
        };

        throw new UnauthorizedException(message, {
          description: exception[info.name] || 'Unauthorized',
        });
      } else {
        throw new UnauthorizedException(message);
      }
    }

    return user;
  }
}