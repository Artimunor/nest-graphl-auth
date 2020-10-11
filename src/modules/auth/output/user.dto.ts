import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDTO {
  @Field()
  token: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  middleName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  profilePicturePath: string;
}
