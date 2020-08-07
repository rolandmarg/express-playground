import { AppError } from './utils/errors';

const env = {
  NODE_ENV: process.env.NODE_ENV as
    | 'production'
    | 'test'
    | 'development'
    | undefined,

  DB_URL: process.env.DB_URL as string,

  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  TOKEN_MAX_AGE: process.env.TOKEN_MAX_AGE as string,

  COOKIE_MAX_AGE: process.env.COOKIE_MAX_AGE as string,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID as string,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET as string,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value && key != 'NODE_ENV') {
    throw new AppError(`process.env.${key} not set`);
  }
});

export default env;
