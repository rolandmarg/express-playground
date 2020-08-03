export const NODE_ENV = process.env.NODE_ENV as
  | 'production'
  | 'development'
  | 'test';

export const DB_URL = process.env.DB_URL as string;

export const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const TOKEN_MAX_AGE = process.env.TOKEN_MAX_AGE as string;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID as string;
export const LINKEDIN_CLIENT_SECRET = process.env
  .LINKEDIN_CLIENT_SECRET as string;
