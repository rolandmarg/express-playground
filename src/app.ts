import { Server } from 'http';
import express, { ErrorRequestHandler } from 'express';
import passport from 'passport';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import 'express-async-errors';
import { apolloMiddleware } from './graphql/apollo';
import { AppError, APP_HOST, APP_PORT } from './utils';
import authRoutes from './auth/routes';

let server: Server;

export const init = async () => {
  const app = express();

  app.use(helmet());
  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(await apolloMiddleware());

  app.use(authRoutes());

  app.use((_req, res) => {
    res.status(404).send('Not found');
  });

  const dreamCatcher: ErrorRequestHandler = (err, _req, res, next) => {
    // TODO maybe logout on unauthorized error
    if (err instanceof AppError) {
      res.status(err.statusCode).send(err.message);
    } else {
      console.error(err);
      const e = new AppError();
      res.status(e.statusCode).send(e.message);
    }

    next();
  };

  app.use(dreamCatcher);

  return app;
};

export const start = async () => {
  const app = await init();

  server = app.listen(APP_PORT, APP_HOST);

  return server;
};

export const stop = () => {
  return server.close();
};
