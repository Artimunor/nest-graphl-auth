import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class AccessToken {
  @Field()
  token: string;

  @Field()
  user: User;
}
