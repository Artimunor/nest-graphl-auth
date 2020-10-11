import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import { LoginInput } from './input/login.input';
import { RegisterInput } from './input/register.input';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtInput } from './input/jwt.input';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { AuthHelper } from './auth.helper';
import { User } from '../user/user.entity';
import { UserDTO } from './output/user.dto';

@Injectable()
export class AuthService {
  private frontendHost: string;
  private frontendPort: number;
  private emailActivated: boolean;

  private confirmUserPrefix = 'user-confirmation';
  private forgotPasswordPrefix = 'forgot-password';
  private jwtBlacklistPrefix = 'jwt-blacklist';

  constructor(
    private userService: UserService,
    private readonly jwt: JwtService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.frontendHost =
      this.configService.get('FRONTEND_HOST') == undefined
        ? ''
        : (this.configService.get('FRONTEND_HOST') as string);
    this.frontendPort =
      this.configService.get('FRONTEND_PORT') == undefined
        ? 3000
        : parseInt(this.configService.get('FRONTEND_PORT') as string);
    this.emailActivated =
      this.configService.get('EMAIL_ACTIVATED') == undefined
        ? false
        : (this.configService.get('EMAIL_ACTIVATED') as boolean);
  }

  public async userRegister(registerInput: RegisterInput): Promise<UserDTO> {
    const userExists = await this.userService.findByEmail(registerInput.email);
    if (userExists) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await AuthHelper.hash(registerInput.password);

    const userCreated = await this.userService.userCreate(
      registerInput.email,
      hashedPassword,
    );

    if (this.emailActivated) {
      const url = await this.createTokenUrl(
        userCreated.id,
        this.confirmUserPrefix,
        'confirm',
      );

      this.mailerService.sendMail({
        to: userCreated.email,
        subject: 'Confirm your Account ✔',
        template: 'account.confirmation.hbs',
        context: {
          url: url,
        },
      });
    } else {
      await this.userService.userConfirm(userCreated.id);
    }

    return {
      token: this.signToken(userCreated.id),
      email: userCreated.email,
      firstName: userCreated.firstName,
      middleName: userCreated.middleName,
      lastName: userCreated.lastName,
      phoneNumber: userCreated.phoneNumber,
      profilePicturePath: userCreated.profilePicturePath,
    };
  }

  public async userLogin(loginInput: LoginInput): Promise<UserDTO> {
    const user = await this.userService.findByEmail(loginInput.email);
    if (!user) {
      throw new BadRequestException('Invalid Login');
    }

    const passwordValid = await AuthHelper.validate(
      loginInput.password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid Login');
    }

    return {
      token: this.signToken(user.id),
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profilePicturePath: user.profilePicturePath,
    };
  }

  public async userLogout(user: User, token: string): Promise<boolean> {
    Logger.log('token: ' + token + ' user: ' + user.email);

    await this.redisService.set(
      this.jwtBlacklistPrefix + ':' + token,
      user.id,
      'ex',
      this.configService.get('JWT_EXPIRE'),
    );

    return true;
  }

  public async isJwtBlacklisted(token: string): Promise<boolean> {
    const userId = await this.redisService.get(
      this.jwtBlacklistPrefix + ':' + token,
    );
    return userId ? true : false;
  }

  public async userConfirm(token: string): Promise<boolean> {
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

  public async userForgotPassword(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return true;
    }

    if (this.emailActivated) {
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
    }

    return true;
  }

  public async validateUser(userId: number) {
    return this.userService.findById(userId);
  }

  public validateToken(token: string): boolean {
    Logger.log('token: ' + token, 'AuthService.validateToken');
    try {
      this.jwt.verify(token);
      return true;
    } catch (error) {
      throw new AuthenticationError('Not Authenticated');
    }
  }

  public async matchRoles(roles: string[], token: string): Promise<boolean> {
    const decoded = this.jwt.decode(token, {
      json: false,
    }) as JwtInput;

    const user = await this.userService.findById(decoded.userId);
    if (!user || !user.role || !user.role.name) {
      return false;
    }

    if (roles.includes(user.role.name)) {
      return true;
    }

    return false;
  }

  public signToken(id: number) {
    const payload: JwtInput = { userId: id };
    return this.jwt.sign(payload);
  }

  private async createTokenUrl(userId: number, prefix: string, path: string) {
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
