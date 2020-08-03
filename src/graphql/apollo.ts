import { Repository, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { AuthDirective } from './authDirective';
import { User, Meeting } from '../entity';
import { APIError } from '../utils/errors';

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
  formatError: (err) => {
    if (err.originalError instanceof APIError) {
      return err;
    } else {
      console.error(err.originalError);
      return new APIError();
    }
  },
});

export const apollo = () => apolloServer.getMiddleware();
