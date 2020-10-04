import { Field, ID, ObjectType, Root } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  middleName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profilePicturePath: string;

  @Column()
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Field()
  @Column('bool', { default: true })
  active: boolean;
}
