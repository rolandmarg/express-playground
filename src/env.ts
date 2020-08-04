import ms from 'ms';
import { AppError } from './utils/errors';

const env = {
  NODE_ENV: process.env.NODE_ENV as
    | 'production'
    | 'test'
    | 'development'
    | undefined,

  DB_URL: process.env.DB_URL as string,

  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  TOKEN_MAX_AGE_IN_MS: ms(process.env.TOKEN_MAX_AGE as string),

  COOKIE_MAX_AGE_IN_SECONDS: ms(process.env.COOKIE_MAX_AGE as string) / 1000,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID as string,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET as string,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new AppError(`${key} env not set in ${env}`);
  }
});

export default env;
