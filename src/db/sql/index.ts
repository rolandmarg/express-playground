import { QueryFile } from 'pg-promise';

import { join as joinPath } from 'path';

function sql(file: string): QueryFile {
  const fullPath: string = joinPath(__dirname, file);

  const qf = new QueryFile(fullPath, { minify: true });

  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
}

export const users = {
  create: sql('users/create.sql'),
  drop: sql('users/drop.sql'),
  delete: sql('users/delete.sql'),
  insert: sql('users/insert.sql'),
  insertOrIgnore: sql('users/insertOrIgnore.sql'),
  selectByEmail: sql('users/selectByEmail.sql'),
};

export const providers = {
  create: sql('providers/create.sql'),
  drop: sql('providers/drop.sql'),
  delete: sql('providers/delete.sql'),
  selectByEmail: sql('providers/selectByEmail.sql'),
};

export const meetings = {
  create: sql('meetings/create.sql'),
  drop: sql('meetings/drop.sql'),
  truncate: sql('meetings/truncate.sql'),
  insert: sql('meetings/insert.sql'),
  select: sql('meetings/select.sql'),
  searchByCursor: sql('meetings/searchByCursor.sql'),
  searchByDate: sql('meetings/searchByDate.sql'),
  selectFirst: sql('meetings/selectFirst.sql'),
  selectLast: sql('meetings/selectLast.sql'),
};

export default {
  users,
  providers,
  meetings,
};
