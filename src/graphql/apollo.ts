import { Repository, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { UserEntity } from '../entity/User';
import { CalendarEventEntity } from '../entity/CalendarEvent';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { AuthDirective } from './authDirective';

export interface IContext {
  req: Request;
  res: Response;
  user?: UserEntity;
  userRepo: Repository<UserEntity>;
  calendarEventRepo: Repository<CalendarEventEntity>;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: { auth: AuthDirective },
  context: ({ req, res }) => {
    const ctx: IContext = {
      req,
      res,
      userRepo: getRepository(UserEntity),
      calendarEventRepo: getRepository(CalendarEventEntity),
    };

    return ctx;
  },
});

export const apollo = () => apolloServer.getMiddleware();
