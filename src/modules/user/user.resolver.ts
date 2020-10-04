import { Resolver, Query, Mutation, Args, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { User } from './user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql.auth.guard';
import { CurrentUser } from '../../shared/decorators/context.decorators';
import { Roles } from '../../shared/decorators/roles.decorators';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async user(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Roles('admin')
  @Query(() => [User])
  async userFind(
    @Args('id', { nullable: true }) id: number,
    @Args('firstName', { nullable: true }) firstName: string,
    @Args('lastName', { nullable: true }) lastName: string,
    @Args('email', { nullable: true }) email: string,
    @Args('entityKey', { nullable: true }) entityKey: string,
    @Args('confirmed', { nullable: true }) confirmed: boolean,
    @Args('active', { nullable: true }) active: boolean,
    @Info() info: GraphQLResolveInfo,
  ): Promise<User[]> {
    return this.userService.userFind(
      info,
      id,
      firstName,
      lastName,
      email,
      entityKey,
      confirmed,
      active,
    );
  }

  @Mutation(() => Boolean)
  async userAddProfilePicture(
    @CurrentUser() user: User,
    @Args('picture', { type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<boolean> {
    const writeResult: Promise<boolean> = new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/images/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    this.userService.userUpdate(user.id, {
      profilePicturePath: `/images/${filename}`,
    });
    return writeResult;
  }

  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @CurrentUser() user: User,
    @Args('data') ui: UserInput,
  ): Promise<User | null> {
    return this.userService.userUpdate(user.id, ui);
  }

  @Mutation(() => Boolean)
  async userDelete(@Args('id') id: number): Promise<boolean> {
    return this.userService.userDelete(id);
  }

  @Mutation(() => User)
  async userGrantRole(
    @Args('id') id: number,
    @Args('roleName') roleName: string,
  ): Promise<User> {
    return await this.userService.userGrantRole(id, roleName);
  }

  @Mutation(() => User)
  async userRevokeRole(@Args('id') id: number): Promise<User> {
    return this.userService.userRevokeRole(id);
  }
}
