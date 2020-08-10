import { MoreThan, FindConditions, getRepository } from 'typeorm';
import { Meeting } from './entity';
import { isIsoDate } from '../utils';

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

export function encodeCursor(opts: { id: number; startsAt: Date }) {
  const cursor = Buffer.from(
    `${opts.id} ${opts.startsAt.toISOString()}`,
    'binary'
  ).toString('base64');

  return cursor;
}

export function decodeCursor(cursor: string) {
  const decoded = Buffer.from(cursor, 'base64').toString('binary');

  const [id, startsAt] = decoded.split(' ');
  return {
    id: +id,
    startsAt,
  };
}

export async function getPaginated(opts: { first: number; after?: string }) {
  const { first, after } = opts;
  const meetingRepo = getRepository(Meeting);

  const findOpts: FindConditions<Meeting> = {};

  if (after && isCursor(after)) {
    const { id, startsAt } = decodeCursor(after);
    findOpts.startsAt = MoreThan(startsAt);
    findOpts.id = MoreThan(id);
  } else if (after) {
    findOpts.startsAt = MoreThan(new Date(after).toISOString());
  }

  const nodesPromise = meetingRepo.find({
    where: {
      ...findOpts,
    },
    order: { startsAt: 'ASC', id: 'ASC' },
    take: first,
  });
  const firstMPromise = meetingRepo.findOne({
    order: {
      startsAt: 'ASC',
      id: 'ASC',
    },
  });
  const lastMPromise = meetingRepo.findOne({
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

  const endCursor = lastM ? encodeCursor(lastM) : undefined;
  const startCursor = firstM ? encodeCursor(firstM) : undefined;

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
}
