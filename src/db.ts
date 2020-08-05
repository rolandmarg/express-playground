import { createConnection } from 'typeorm';
import env from './env';

import { User } from './entity/User';
import { Meeting } from './entity/Meeting';

export { User, Meeting };

export const connect = () => {
  return createConnection({
    type: 'postgres',
    url: env.DB_URL,
    synchronize: env.NODE_ENV !== 'production',
    entities: [User, Meeting],
    logging: ['info'],
  });
};

export * from 'typeorm';
