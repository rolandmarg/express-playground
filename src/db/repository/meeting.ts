import { getManager, MoreThan, FindConditions } from 'typeorm';
import { Meeting } from '../entity/Meeting';
import { isIsoDate } from '../../utils';

export const isCursor = (str: string) => {
  const decoded = Buffer.from(str, 'base64').toString('binary');

  const [id, startsAt] = decoded.split(' ');

  if (isNaN(+id)) {
    return false;
  }

  if (!isIsoDate(startsAt)) {
    return false;
  }

  return true;
};

interface encodeCursorOptions {
  id: number;
  startsAt: Date;
}
export const encodeCursor = ({ id, startsAt }: encodeCursorOptions) => {
  const cursor = Buffer.from(
    `${id} ${startsAt.toISOString()}`,
    'binary'
  ).toString('base64');

  return cursor;
};

export const decodeCursor = (cursor: string) => {
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

  const findOpts: FindConditions<Meeting> = {};

  if (after && isCursor(after)) {
    const { id, startsAt } = decodeCursor(after);
    findOpts.startsAt = MoreThan(startsAt);
    findOpts.id = MoreThan(id);
  } else if (after) {
    findOpts.startsAt = MoreThan(new Date(after).toISOString());
  }

  const nodesPromise = getManager().find(Meeting, {
    where: {
      ...findOpts,
    },
    order: { startsAt: 'ASC', id: 'ASC' },
    take: first,
  });
  const firstMPromise = getManager().findOne(Meeting, {
    order: {
      startsAt: 'ASC',
      id: 'ASC',
    },
  });
  const lastMPromise = getManager().findOne(Meeting, {
    order: {
      startsAt: 'DESC',
      id: 'DESC',
    },
  });

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
