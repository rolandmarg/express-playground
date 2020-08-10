import { createParamDecorator } from 'type-graphql';
import { Context } from '../graphql/context';

export const CurrentUser = () => {
  return createParamDecorator<Context>(({ context }) => context.currentUser);
};
