import { Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { Role } from './role.entity';
import { RoleInput } from './role.input';

@Injectable()
export class RoleService {
  public async roleFind(
    info: GraphQLResolveInfo,
    id?: number,
    name?: string,
    description?: string,
  ): Promise<Role[]> {
    const resultInfo = parseResolveInfo(info);
    if (resultInfo) {
      let rq = Role.createQueryBuilder('role');

      if (id) {
        rq = rq.andWhere('role.id = :id', {
          id: id,
        });
      }

      if (name) {
        rq = rq.andWhere('role.name = :name', {
          name: name,
        });
      }

      if (description) {
        rq = rq.andWhere('role.description = :description', {
          description: description,
        });
      }

      return rq.getMany();
    } else {
      throw new Error('Unable to parse graphql info object');
    }
  }

  public async roleCreate(ri: RoleInput): Promise<Role> {
    return await Role.create({
      name: ri.name,
      description: ri.description,
    }).save();
  }

  public async roleDelete(id: number): Promise<boolean> {
    const res = await Role.delete(id);
    return res.affected == null ? false : res.affected > 0;
  }

  public async roleUpdate(id: number, ri: RoleInput): Promise<Role> {
    const role = await Role.findOne(id);
    if (!role) {
      return null;
    }

    if (ri.name) {
      role.name = ri.name;
    }

    if (ri.description) {
      role.description = ri.description;
    }

    return role.save();
  }
}
