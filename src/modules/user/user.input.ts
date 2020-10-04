import { IsEmail, MinLength, IsPhoneNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  middleName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsPhoneNumber('ZZ')
  phoneNumber?: string;

  @Field({ nullable: true })
  profilePicturePath?: string;

  @Field({ nullable: true })
  @MinLength(8)
  password?: string;
}
