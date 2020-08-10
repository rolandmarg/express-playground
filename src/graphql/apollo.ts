import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { AuthDirective } from './authDirective';
import { AppError } from '../utils';
import { User } from '../entity/User';

export interface Context {
  req: Request;
  res: Response;
  currentUser?: User;
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: { auth: AuthDirective },
  context: ({ req, res }): Context => {
    return { req, res };
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
