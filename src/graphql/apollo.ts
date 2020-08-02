import { Repository, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { AuthDirective } from './authDirective';
import { User, Meeting } from '../entity';

export interface IContext {
  req: Request;
  res: Response;
  user?: User;
  userRepo: Repository<User>;
  meetingRepo: Repository<Meeting>;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: { auth: AuthDirective },
  context: ({ req, res }) => {
    const ctx: IContext = {
      req,
      res,
      userRepo: getRepository(User),
      meetingRepo: getRepository(Meeting),
    };

    return ctx;
  },
});

export const apollo = () => apolloServer.getMiddleware();
