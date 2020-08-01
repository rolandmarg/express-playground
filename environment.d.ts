declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DB_URL: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      TOKEN_MAX_AGE: string;
      TOKEN_SECRET: string;
    }
  }
}

export {};
