import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './schema';
import { context } from './context';

let server: ApolloServer;

const initApollo = async () => {
  const schema = await createSchema();

  server = new ApolloServer({
    schema,
    context,
    formatError: (err) => {
      console.error(err);
      return err;
    },
  });
};

export const apollo = async () => {
  if (!server) {
    await initApollo();
  }

  return server;
};

export const apolloMiddleware = async () => {
  if (!server) {
    await initApollo();
  }

  return server.getMiddleware();
};
