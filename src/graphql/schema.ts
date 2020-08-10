import { buildSchema } from 'type-graphql';
import { MeetingResolver } from '../meeting/resolver';
import { UserResolver } from '../user/resolver';
import { customAuthChecker } from './authChecker';

export const createSchema = async () => {
  const schema = await buildSchema({
    resolvers: [MeetingResolver, UserResolver],
    authChecker: customAuthChecker,
  });

  return schema;
};
