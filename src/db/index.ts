import { createConnection, Connection } from 'typeorm';
import env from '../env';

import { User } from './entity/User';
import { Meeting } from './entity/Meeting';
import { Provider } from './entity/Provider';

export * from 'typeorm';
export * as meetingRepo from './repository/meeting';
export * as userRepo from './repository/user';

export { User, Meeting, Provider };

let connection: Connection;

export const connect = async () => {
  connection = await createConnection({
    type: 'postgres',
    host: env.DB_HOST,
    port: +env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    synchronize: env.NODE_ENV !== 'production',
    entities: [User, Meeting, Provider],
  });

  return connection;
};

export const close = async () => {
  return connection.close();
};
