import { createConnection, Connection } from 'typeorm';
import {
  NODE_ENV,
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from './utils';
import { User } from './user/entity';
import { Meeting } from './meeting/entity';
import { Provider } from './provider/entity';

let connection: Connection;

export const connect = async () => {
  connection = await createConnection({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: NODE_ENV !== 'production',
    entities: [User, Meeting, Provider],
  });

  return connection;
};

export const close = async () => {
  return connection.close();
};
