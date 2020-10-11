import { Field, ID, ObjectType, Root } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Role } from '../role/role.entity';

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

  @Column({ nullable: true })
  googleToken: string;

  @Column({ nullable: true })
  googleRefreshToken: string;

  @Column({ nullable: true })
  linkedInToken: string;

  @Column({ nullable: true })
  linkedInRefreshToken: string;

  @Column({ nullable: true })
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Field()
  @Column('bool', { default: true })
  active: boolean;

  @Field({ nullable: true })
  @ManyToOne(() => Role, { nullable: true, eager: true })
  role: Role;
}
