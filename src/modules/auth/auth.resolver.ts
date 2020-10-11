import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterInput } from './input/register.input';
import { AuthService } from './auth.service';
import { LoginInput } from './input/login.input';
import { User } from '../user/user.entity';
import { CurrentUser, Jwt } from '../../shared/decorators/context.decorators';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql.auth.guard';
import { UserDTO } from './output/user.dto';

@Resolver('Authentication')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserDTO)
  async userRegister(
    @Args({ name: 'registerInput', type: () => RegisterInput })
    registerInput: RegisterInput,
  ): Promise<UserDTO> {
    return this.authService.userRegister(registerInput);
  }

  @Mutation(() => Boolean)
  async userConfirm(@Args('token') token: string): Promise<boolean> {
    return this.authService.userConfirm(token);
  }

  @Mutation(() => UserDTO)
  async userLogin(
    @Args({ name: 'loginInput', type: () => LoginInput })
    loginInput: LoginInput,
  ): Promise<UserDTO> {
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
