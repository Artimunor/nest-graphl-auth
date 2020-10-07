import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Roles } from '../../shared/decorators/roles.decorators';
import { GqlAuthGuard } from '../auth/guards/gql.auth.guard';
import { Role } from './role.entity';
import { RoleInput } from './role.input';
import { RoleService } from './role.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Roles('admin')
  @Query(() => [Role])
  async roleFind(
    @Args('id', { nullable: true }) id: number,
    @Args('name', { nullable: true }) name: string,
    @Args('description', { nullable: true }) description: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Role[]> {
    return this.roleService.roleFind(info, id, name, description);
  }

  @Roles('admin')
  @Mutation(() => Role)
  roleCreate(@Args('data') ri: RoleInput): Promise<Role> {
    return this.roleService.roleCreate(ri);
  }

  @Roles('admin')
  @Mutation(() => Role, { nullable: true })
  async roleUpdate(
    @Args('id') id: number,
    @Args('role') ri: RoleInput,
  ): Promise<Role> {
    return this.roleService.roleUpdate(id, ri);
  }

  @Roles('admin')
  @Mutation(() => Boolean)
  async roleDelete(@Args('id') id: number): Promise<boolean> {
    return this.roleService.roleDelete(id);
  }
}
