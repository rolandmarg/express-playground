import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { meetings as sql } from '../sql';
import { MeetingIn, Meeting } from '../types';
import { isIsoDate, AppError } from '../../utils';

export function encodeCursor(opts: { id: number; startsAt: Date }) {
  const cursor = Buffer.from(
    `${opts.id} ${opts.startsAt.toISOString()}`,
    'binary'
  ).toString('base64');

  return cursor;
}

export function isCursor(str: string) {
  const decoded = Buffer.from(str, 'base64').toString('binary');

  const [id, startsAt] = decoded.split(' ');

  if (isNaN(+id)) {
    return false;
  }

  if (!isIsoDate(startsAt)) {
    return false;
  }

  return true;
}

export function decodeCursor(cursor: string) {
  const decoded = Buffer.from(cursor, 'base64').toString('binary');

  const [id, startsAt] = decoded.split(' ');
  return {
    id: +id,
    startsAt,
  };
}

export class MeetingRepository {
  constructor(private db: IDatabase<unknown, IClient>) {}

  async create() {
    return this.db.none(sql.create);
  }

  async drop() {
    return this.db.none(sql.drop);
  }

  async truncate() {
    return this.db.none(sql.truncate);
  }

  async insert(meeting: MeetingIn) {
    return this.db.one<Meeting>(sql.insert, meeting);
  }

  async getPaginated({ first, after }: { first: number; after?: string }) {
    if (first < 1) {
      throw new AppError(
        'Parameter `first` of getPaginated should be greater than 1'
      );
    }
    const result = await this.db.task('meetings-get-paginated', async (t) => {
      let q1;

      if (after && isCursor(after)) {
        const { id, startsAt } = decodeCursor(after);
        q1 = t.any(sql.searchByCursor, {
          id,
          startsAt,
          num: first,
        });
      } else if (after) {
        q1 = t.any(sql.searchByDate, { startsAt: new Date(after), num: first });
      } else {
        q1 = t.any(sql.select, { num: first });
      }

      const q2 = t.oneOrNone(sql.selectFirst);
      const q3 = t.oneOrNone(sql.selectLast);

      const [meetings, firstM, lastM] = await t.batch([q1, q2, q3]);
      const edges = (meetings as Meeting[]).map((node) => {
        return { node, cursor: encodeCursor(node) };
      });

      const endCursor = lastM ? encodeCursor(lastM) : null;
      const startCursor = firstM ? encodeCursor(firstM) : null;

      let hasPreviousPage = false;
      let hasNextPage = false;

      if (edges.length) {
        if (edges[0].cursor !== startCursor) {
          hasPreviousPage = true;
        }
        if (edges[edges.length - 1].cursor !== endCursor) {
          hasNextPage = true;
        }
      }

      return {
        edges,
        pageInfo: {
          endCursor,
          startCursor,
          hasNextPage,
          hasPreviousPage,
        },
      };
    });

    return result;
  }
}
