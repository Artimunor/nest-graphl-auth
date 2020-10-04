import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterInput } from './input/register.input';
import { AuthService } from './auth.service';
import { AccessToken } from './output/access-token';
import { LoginInput } from './input/login.input';

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

  @Mutation(() => Boolean)
  async userForgotPassword(@Args('email') email: string): Promise<boolean> {
    return this.authService.userForgotPassword(email);
  }
}
