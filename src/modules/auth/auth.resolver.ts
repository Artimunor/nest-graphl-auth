import * as bcrypt from 'bcryptjs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RegisterInput } from './input/register.input';
import { UserService } from '../user/user.service';
import { GqlResponse } from '../../shared/decorators/decorators';
import { v4 } from 'uuid';
import { Logger, Response, UseGuards } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { LocalAuthGuard } from './guards/auth.guard';
import { AuthenticationError } from 'apollo-server-express';
import { AuthService } from './auth.service';
import { AccessToken } from './output/AccessToken';

@Resolver('Authentication')
export class AuthResolver {
  frontendHost: string;
  frontendPort: number;

  confirmUserPrefix = 'user-confirmation';
  forgotPasswordPrefix = 'forgot-password';

  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
  ) {
    this.frontendHost =
      this.configService.get('FRONTEND_HOST') == undefined
        ? ''
        : (this.configService.get('FRONTEND_HOST') as string);
    this.frontendPort =
      this.configService.get('FRONTEND_PORT') == undefined
        ? 3000
        : parseInt(this.configService.get('FRONTEND_PORT') as string);
  }

  @Mutation(() => AccessToken)
  @UseGuards(LocalAuthGuard)
  async userLogin(
    @Args('email') email: string,
    @Args('password') password: string,
    @GqlResponse() response: Response,
  ): Promise<AccessToken> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Not Authenticated');
    }

    return this.authService.login(email, password);
  }

  @Mutation(() => User)
  async userRegister(
    @Args('registerInput') registerInput: RegisterInput,
    @GqlResponse() res: Response,
  ): Promise<User> {
    const emailExists = await this.userService.findByEmail(registerInput.email);
    if (emailExists) {
      throw Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(registerInput.password, 12);

    const user = await this.userService.userCreate(
      registerInput.email,
      hashedPassword,
    );

    const url = await this.createTokenUrl(
      user.id,
      this.confirmUserPrefix,
      'confirm',
    );

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your Account ✔',
      template: 'account.confirmation.hbs',
      context: {
        url: url,
      },
    });

    return user;
  }

  @Mutation(() => Boolean)
  async userConfirm(@Args('token') token: string): Promise<boolean> {
    const userId = await this.redisService.get(
      this.confirmUserPrefix + ':' + token,
    );

    if (!userId) {
      return false;
    }

    await this.userService.userConfirm(parseInt(userId, 10));
    await this.redisService.del(token);

    return true;
  }

  @Mutation(() => Boolean)
  async userForgotPassword(@Args('email') email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return true;
    }

    const url = await this.createTokenUrl(
      user.id,
      this.forgotPasswordPrefix,
      'account/change-password',
    );

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset the password of your account',
      template: 'account.resetpassword.hbs',
      context: {
        url: url,
      },
    });

    return true;
  }

  async createTokenUrl(userId: number, prefix: string, path: string) {
    const token = v4();
    Logger.log(`${prefix} token: ${token}`, 'createTokenUrl');
    await this.redisService.set(
      prefix + ':' + token,
      userId,
      'ex',
      60 * 60 * 24,
    );

    return `${this.frontendHost}:${this.frontendPort}/${path}/${token}`;
  }
}
