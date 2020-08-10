import ms from 'ms';
import { AppError } from './errors';

export const NODE_ENV = process.env.NODE_ENV as
  | 'production'
  | 'test'
  | 'development'
  | undefined;

const getEnv = (name: string) => {
  const env = process.env[name];

  if (!env && NODE_ENV !== 'test') {
    throw new AppError(`${name} not set in .env file`);
  }

  return env as string;
};

const getOptEnv = (name: string): string | undefined => {
  const env = process.env[name];

  return env;
};

export const APP_PORT = +getEnv('APP_PORT');
export const APP_HOST = getEnv('APP_HOST');

export const DB_USER = getEnv('DB_USER');
export const DB_PASSWORD = getOptEnv('DB_PASSWORD');
export const DB_HOST = getEnv('DB_HOST');
export const DB_PORT = +getEnv('DB_PORT');
export const DB_DATABASE = getEnv('DB_DATABASE');

export const TOKEN_SECRET = getEnv('TOKEN_SECRET');
export const TOKEN_MAX_AGE_IN_MS = ms(getEnv('TOKEN_MAX_AGE'));

export const COOKIE_MAX_AGE_IN_MS = ms(getEnv('COOKIE_MAX_AGE'));

export const GOOGLE_CLIENT_ID = getEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = getEnv('GOOGLE_CLIENT_SECRET');

export const LINKEDIN_CLIENT_ID = getEnv('LINKEDIN_CLIENT_ID');
export const LINKEDIN_CLIENT_SECRET = getEnv('LINKEDIN_CLIENT_SECRET');
