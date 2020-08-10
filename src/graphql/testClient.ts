import {
  createTestClient,
  ApolloServerTestClient,
} from 'apollo-server-testing';
import { apollo } from './apollo';

let client: ApolloServerTestClient;

const initClient = async () => {
  const server = await apollo();

  client = createTestClient(server);

  return client;
};

type Query = Parameters<typeof client.query>[0];
type Mutation = Parameters<typeof client.mutate>[0];

export const query = async (query: Query) => {
  if (!client) {
    await initClient();
  }

  return client.query(query);
};

export const mutate = async (mutation: Mutation) => {
  if (!client) {
    await initClient();
  }

  return client.mutate(mutation);
};
