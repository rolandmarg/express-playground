import { createConnection, Connection } from 'typeorm';
import env from './env';

import { User } from './entity/User';
import { Meeting } from './entity/Meeting';

export { User, Meeting };

let connection: Connection;

export const connect = async () => {
  connection = await createConnection({
    type: 'postgres',
    url: env.DB_URL,
    synchronize: env.NODE_ENV !== 'production',
    entities: [User, Meeting],
    logging: ['info'],
  });

  return connection;
};

export const close = async () => {
  return connection.close();
};

export * from 'typeorm';
