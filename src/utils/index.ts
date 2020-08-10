import { promisify } from 'util';

export * from './errors';
export * from './iron';
export * from './env';

export const sleep = promisify(setTimeout);

export const isIsoDate = (str: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
    return false;
  }

  return new Date(str).toISOString() === str;
};
