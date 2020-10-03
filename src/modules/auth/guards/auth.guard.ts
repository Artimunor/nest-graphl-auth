import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly auth: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // async canActivate(context: ExecutionContext): Promise<any> {
  //   const ctx = GqlExecutionContext.create(context);
  //   return this.auth.validateUser(ctx.getArgs().email, ctx.getArgs().password);
  // }
}

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

// @Injectable()
// export class HttpAuthGuard implements CanActivate {

//   canActivate(context: ExecutionContext) {
//     // Get the header
//     const authHeader = context.switchToHttp().getRequest().headers
//       .authorization as string;

//     if (!authHeader) {
//       throw new BadRequestException('Authorization header not found.');
//     }
//     const [type, token] = authHeader.split(' ');
//     if (type !== 'Bearer') {
//       throw new BadRequestException(
//         `Authentication type \'Bearer\' required. Found \'${type}\'`,
//       );
//     }
//     const validationResult = this.auth.ValidateToken(token);
//     if (validationResult === true) {
//       return true;
//     }
//     throw new UnauthorizedException(validationResult);
//   }
// }

// @Injectable()
// export class WsAuthGuard implements CanActivate {
//   constructor(private readonly auth: AuthService) {}

//   canActivate(context: ExecutionContext) {
//     // Since a GraphQl subscription uses Websockets,
//     //     we can't pass any headers. So we pass the token inside the query itself
//     const token = context.switchToWs().getData().token;

//     if (!token) {
//       throw new BadRequestException('Authentication token not found.');
//     }

//     const validationResult = await this.auth.validateToken(token);
//     if (validationResult === true) {
//       return true;
//     }
//     throw new UnauthorizedException(validationResult);
//   }
// }
