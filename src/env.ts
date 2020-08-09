import { AppError } from './utils/errors';

const env = {
  NODE_ENV: process.env.NODE_ENV as
    | 'production'
    | 'test'
    | 'development'
    | undefined,

  APP_PORT: process.env.APP_PORT as string,
  APP_HOST: process.env.APP_HOST as string,

  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: process.env.DB_PORT as string,
  DB_DATABASE: process.env.DB_DATABASE as string,

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
