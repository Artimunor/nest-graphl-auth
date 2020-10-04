import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { User } from '../../modules/user/user.entity';

export const GqlRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): Request =>
    GqlExecutionContext.create(context).getContext().req,
);

export const Jwt = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = GqlExecutionContext.create(context).getContext().req;
    return request.headers.authorization.split(' ')[1];
  },
);

export const GqlResponse = createParamDecorator(
  (data: unknown, context: ExecutionContext): Response =>
    GqlExecutionContext.create(context).getContext().res,
);

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req && ctx.req.user;
  },
);
