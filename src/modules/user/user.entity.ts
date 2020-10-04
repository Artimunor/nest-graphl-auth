import { Field, ID, ObjectType, Root } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  middleName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field()
  @Column('text')
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePicturePath: string;

  @Field()
  name(@Root() parent: User): string {
    return (
      parent.firstName +
      ' ' +
      (parent.middleName ? parent.middleName + ' ' : '') +
      parent.lastName
    );
  }

  @Column()
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Field()
  @Column('bool', { default: true })
  active: boolean;
}
