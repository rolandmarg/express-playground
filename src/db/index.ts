import pgPromise, { IInitOptions, IDatabase, IMain } from 'pg-promise';
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USER, DB_HOST } from '../utils';
import { MeetingRepository } from './repos/meeting';
import { UserRepository } from './repos/user';
import { ProviderRepository } from './repos/provider';

interface IExtensions {
  meetings: MeetingRepository;
  users: UserRepository;
  providers: ProviderRepository;
  createTables(): Promise<void>;
  close(): void;
}

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const initOptions: IInitOptions<IExtensions> = {
  extend(obj: ExtendedProtocol) {
    obj.meetings = new MeetingRepository(obj);
    obj.providers = new ProviderRepository(obj, pgp);
    obj.users = new UserRepository(obj, obj.providers);

    obj.createTables = async () => {
      await obj.meetings.create();
      await obj.users.create();
      await obj.providers.create();
    };

    obj.close = () => {
      pgp.end();
    };
  },
  receive(data) {
    camelizeColumns(data);
  },
};

function camelizeColumns(data: any[]) {
  const tmp = data[0];
  for (const prop in tmp) {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in tmp)) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
}

const pgp: IMain = pgPromise(initOptions);

const db: ExtendedProtocol = pgp({
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USER,
  host: DB_HOST,
});

export { db, pgp };

export * from './types';
