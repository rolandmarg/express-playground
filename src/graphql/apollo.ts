import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { AuthDirective } from './authDirective';
import { User } from '../entity';
import { AppError } from '../utils';

export interface IContext {
  req: Request;
  res: Response;
  user?: User;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: { auth: AuthDirective },
  formatError: (err) => {
    if (err.originalError instanceof AppError) {
      return err;
    } else {
      console.error(err);
      return new AppError();
    }
  },
});

export const apollo = () => apolloServer.getMiddleware();
