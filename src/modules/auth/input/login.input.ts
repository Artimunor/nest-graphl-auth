import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(8)
  readonly password: string;
}
