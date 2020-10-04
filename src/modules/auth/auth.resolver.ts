import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterInput } from './input/register.input';
import { AuthService } from './auth.service';
import { AccessToken } from './output/access-token';
import { LoginInput } from './input/login.input';
import { User } from '../user/user.entity';
import { CurrentUser, Jwt } from '../../shared/decorators/context.decorators';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql.auth.guard';

@Resolver('Authentication')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccessToken)
  async userRegister(
    @Args({ name: 'registerInput', type: () => RegisterInput })
    registerInput: RegisterInput,
  ): Promise<AccessToken> {
    return this.authService.userRegister(registerInput);
  }

  @Mutation(() => Boolean)
  async userConfirm(@Args('token') token: string): Promise<boolean> {
    return this.authService.userConfirm(token);
  }

  @Mutation(() => AccessToken)
  async userLogin(
    @Args({ name: 'loginInput', type: () => LoginInput })
    loginInput: LoginInput,
  ): Promise<AccessToken> {
    return this.authService.userLogin(loginInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async userLogout(
    @CurrentUser() user: User,
    @Jwt() token: string,
  ): Promise<boolean> {
    return this.authService.userLogout(user, token);
  }

  @Mutation(() => Boolean)
  async userForgotPassword(@Args('email') email: string): Promise<boolean> {
    return this.authService.userForgotPassword(email);
  }
}
