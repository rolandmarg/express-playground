import { createConnection, Connection } from 'typeorm';
import env from '../env';

import { User } from './entity/User';
import { Meeting } from './entity/Meeting';
import { Provider } from './entity/Provider';

export * from 'typeorm';
export * as meetingRepo from './repository/meeting';

export { User, Meeting, Provider };

let connection: Connection;
export const connect = async () => {
  connection = await createConnection({
    type: 'postgres',
    url: env.DB_URL,
    synchronize: env.NODE_ENV !== 'production',
    entities: [User, Meeting, Provider],
  });

  return connection;
};

export const close = async () => {
  return connection.close();
};
