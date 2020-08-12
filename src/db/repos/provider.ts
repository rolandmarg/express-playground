import { IDatabase, IMain, ColumnSet } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { providers as sql } from '../sql';
import { ProviderIn, User } from '../types';

let cs: ColumnSet;

function createColumnSets(pgp: IMain) {
  if (!cs) {
    cs = new pgp.helpers.ColumnSet(
      [
        { name: 'email', cnd: true },
        { name: 'provider_name', prop: 'providerName', cnd: true },
        { name: 'provider_id', prop: 'providerId' },
        { name: 'access_token', prop: 'accessToken' },
        { name: 'refresh_token', prop: 'refreshToken', def: null },
        { name: 'photo', def: null },
        { name: 'display_name', prop: 'displayName', def: null },
        { name: 'full_name', prop: 'fullName', def: null },
        { name: 'user_id', prop: 'userId' },
      ],
      { table: 'providers' }
    );
  }
}

export class ProviderRepository {
  constructor(
    private readonly db: IDatabase<unknown, IClient>,
    private readonly pgp: IMain
  ) {
    createColumnSets(pgp);
  }

  async create() {
    return this.db.none(sql.create);
  }

  async drop() {
    return this.db.none(sql.drop);
  }

  async delete() {
    return this.db.none(sql.delete);
  }

  selectQuery(email: string) {
    const query = this.pgp.as.format(sql.selectByEmail, { email });

    return query;
  }

  upsertQuery(provider: ProviderIn, user: User) {
    const insertData = { ...provider, userId: user.id };
    const { email, providerName, ...updateData } = insertData;

    const insertQuery = this.pgp.helpers.insert(insertData, cs);
    const setQuery = this.pgp.helpers.sets(updateData, cs);

    const query =
      insertQuery +
      ' ON CONFLICT(email, provider_name) DO UPDATE SET ' +
      setQuery;
    return query;
  }
}
