import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { AuthDirective } from './authDirective';
import { AppError } from '../utils';

export interface IContext {
  req: Request;
  res: Response;
  auth?: any;
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: { auth: AuthDirective },
  context: ({ req, res }) => {
    const ctx: IContext = {
      req,
      res,
    };

    return ctx;
  },
  formatError: (err) => {
    if (err.originalError instanceof AppError) {
      return err;
    } else {
      console.error(err);
      console.error(err.originalError);
      return new AppError();
    }
  },
});

export const apollo = () => apolloServer.getMiddleware();
