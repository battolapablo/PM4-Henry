import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

@Injectable()
export class AuthHeaderGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : '';

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });
      if (payload.iat) {
        payload.iat = new Date(payload.iat * 1000);
      }
      if (payload.exp) {
        payload.exp = new Date(payload.exp * 1000);
      }
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Expired Token');
    }
  }
}
