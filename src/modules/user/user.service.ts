import { Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { UserInput } from './user.input';

@Injectable()
export class UserService {
  public async userFind(
    info: GraphQLResolveInfo,
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    entityKey?: string,
    confirmed?: boolean,
    active?: boolean,
  ): Promise<User[]> {
    const resultInfo = parseResolveInfo(info);
    if (resultInfo) {
      const reqFields = resultInfo.fieldsByTypeName.User;

      let eq = User.createQueryBuilder('user');

      const entityRequested = reqFields.hasOwnProperty('userEntity');
      if (entityKey) {
        if (entityRequested) {
          eq = eq.leftJoinAndSelect('user.userEntity', 'wpentity');
        } else {
          eq = eq.leftJoin('user.userEntity', 'wpentity');
        }
        eq = eq.andWhere('wpentity.key = :entityKey', { entityKey: entityKey });
      } else {
        if (entityRequested) {
          eq = eq.leftJoinAndSelect('user.userEntity', 'wpentity');
        }
      }

      if (id) {
        eq = eq.andWhere('user.id = :id', {
          id: id,
        });
      }

      if (firstName) {
        eq = eq.andWhere('user.firstName = :firstName', {
          firstName: firstName,
        });
      }

      if (lastName) {
        eq = eq.andWhere('user.lastName = :lastName', {
          lastName: lastName,
        });
      }

      if (email) {
        eq = eq.andWhere('user.email = :email', {
          email: email,
        });
      }

      if (confirmed != null && confirmed != undefined) {
        eq = eq.andWhere('user.confirmed = :confirmed', {
          confirmed: confirmed,
        });
      }

      if (active != null && active != undefined) {
        eq = eq.andWhere('user.active = :active', {
          active: active,
        });
      }

      return eq.getMany();
    } else {
      throw new Error('Unable to parse graphql info object');
    }
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return User.findOne({ email: email });
  }

  public async findById(id: number): Promise<User | undefined> {
    return User.findOne(id);
  }

  public async userCreate(email: string, password: string): Promise<User> {
    return await User.create({
      email: email,
      password: password,
    }).save();
  }

  public async userCreateOrUpdate(user: User): Promise<User> {
    return await user.save();
  }

  public async userDelete(id: number): Promise<boolean> {
    const res = await User.delete(id);
    return res.affected == null ? false : res.affected > 0;
  }

  public async userUpdate(id: number, ui: UserInput): Promise<User> {
    const user = await User.findOne(id);
    if (!user) {
      return null;
    }

    if (ui.firstName) {
      user.firstName = ui.firstName;
    }

    if (ui.middleName) {
      user.middleName = ui.middleName;
    }

    if (ui.lastName) {
      user.lastName = ui.lastName;
    }

    if (ui.email) {
      user.email = ui.email;
    }

    if (ui.phoneNumber) {
      user.phoneNumber = ui.phoneNumber;
    }

    return user.save();
  }

  public async userConfirm(id: number): Promise<boolean> {
    const user = await User.findOne(id);
    if (!user) {
      return null;
    }
    user.confirmed = true;

    await user.save();

    return true;
  }

  public async userGrantRole(id: number, roleName: string): Promise<User> {
    const user = await User.findOne(id);
    if (!user) {
      throw new Error('User does not exist');
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      throw new Error('Role with name [' + roleName + '] does not exist');
    }

    user.role = role;

    return user.save();
  }

  public async userRevokeRole(id: number): Promise<User> {
    const user = await User.findOne(id);
    if (!user) {
      throw new Error('User does not exist');
    }

    user.role = null;

    return user.save();
  }
}
