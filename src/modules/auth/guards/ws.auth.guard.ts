import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext) {
    const token = context.switchToWs().getData().token;

    if (!token) {
      throw new BadRequestException('Authentication token not found.');
    }

    const validationResult = this.auth.validateToken(token);
    if (validationResult === true) {
      return true;
    }
    throw new UnauthorizedException(validationResult);
  }
}
