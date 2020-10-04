import { Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { Role } from './role.entity';

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
}
