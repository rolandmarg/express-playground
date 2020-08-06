import { getConnection } from 'typeorm';
import { Meeting } from '../entity/Meeting';

const query = () => getConnection().createQueryBuilder(Meeting, 'meeting');

const isCursor = (str: string) => {
  return Buffer.from(str, 'base64').toString('base64') === str;
};

const encodeCursor = (meeting: Meeting) => {
  const cursor = Buffer.from(
    `${meeting.id} ${meeting.startsAt}`,
    'binary'
  ).toString('base64');

  return cursor;
};

const decodeCursor = (cursor: string) => {
  const decoded = Buffer.from(cursor, 'base64').toString('binary');

  const [id, startsAt] = decoded.split(' ');
  return {
    id: +id,
    startsAt,
  };
};

interface getPaginatedOptions {
  first: number;
  after: string | null | undefined;
}

export const getPaginated = async (options: getPaginatedOptions) => {
  const { first, after } = options;

  let qb = query();

  if (after && isCursor(after)) {
    const { id, startsAt } = decodeCursor(after);
    qb = qb
      .where('meeting.startsAt > :startsAt', { startsAt })
      .andWhere('meeting.id > :id', { id });
  } else if (after) {
    qb = qb.where('meeting.startsAt > :after', { after });
  }

  const nodesPromise = qb
    .orderBy('meeting.startsAt')
    .addOrderBy('meeting.id')
    .take(first)
    .getMany();
  const firstMPromise = await query()
    .orderBy('meeting.startsAt')
    .addOrderBy('meeting.id')
    .getOne();
  const lastMPromise = await query()
    .orderBy('meeting.startsAt', 'DESC')
    .addOrderBy('meeting.id', 'DESC')
    .getOne();

  const [nodes, firstM, lastM] = await Promise.all([
    nodesPromise,
    firstMPromise,
    lastMPromise,
  ]);

  const edges = nodes.map((node) => {
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
};
