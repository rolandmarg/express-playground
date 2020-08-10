import { AuthChecker } from 'type-graphql';
import { Context } from './context';
import { authRequest } from '../auth/helpers';

export const customAuthChecker: AuthChecker<Context> = async ({ context }) => {
  const user = await authRequest(context.req);

  context.currentUser = user;

  return !!context.currentUser;
};
