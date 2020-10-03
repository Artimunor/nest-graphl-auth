import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Info,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { User } from './user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userRepository: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Context('currentUser') currentUser: User): Promise<User> {
    return currentUser;
  }

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
    return this.userRepository.userFind(
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

  // only allow if user is logged in and then add path to picture to User.profilePicturePath
  @Mutation(() => Boolean)
  async userAddProfilePicture(
    @Args('picture', { type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/images/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }

  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Args('id') id: number,
    @Args('data') ui: UserInput,
  ): Promise<User | null> {
    return this.userRepository.userUpdate(id, ui);
  }

  @Mutation(() => Boolean)
  async userDelete(@Args('id') id: number): Promise<boolean> {
    return this.userRepository.userDelete(id);
  }
}