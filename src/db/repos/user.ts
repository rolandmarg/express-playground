import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { users as sql } from '../sql';
import { User, ProviderIn } from '../types';
import { ProviderRepository } from './provider';

export class UserRepository {
  constructor(
    private readonly db: IDatabase<unknown, IClient>,
    private readonly providerRepo: ProviderRepository
  ) {}

  async create() {
    return this.db.none(sql.create);
  }

  async drop() {
    return this.db.none(sql.drop);
  }

  async delete() {
    return this.db.none(sql.delete);
  }

  async selectByEmail(email: string) {
    const result = await this.db.task('user-select-by-email', async (t) => {
      const user = await t.oneOrNone<User>(sql.selectByEmail, { email });

      if (user) {
        const query = this.providerRepo.selectQuery(email);

        user.providers = await t.many(query);
      }

      return user;
    });

    return result;
  }

  async insert(email: string) {
    return this.db.one<User>(sql.insert, { email });
  }

  async upsertByProvider(provider: ProviderIn) {
    const result = this.db.tx('user-upsert-by-provider', async (t) => {
      await t.none(sql.insertOrIgnore, {
        email: provider.email,
      });

      const user = await t.one<User>(sql.selectByEmail, {
        email: provider.email,
      });

      const query = this.providerRepo.upsertQuery(provider, user);

      await t.none(query);

      return user;
    });

    return result;
  }
}
