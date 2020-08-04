import { promisify } from 'util';

export * from './errors';

export const sleep = promisify(setTimeout);
