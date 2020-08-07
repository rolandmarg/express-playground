import express, { ErrorRequestHandler } from 'express';
import passport from 'passport';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import 'express-async-errors';
import { apollo } from './graphql';
import { routes } from './routes';
import { AppError } from './utils';

const app = express();

app.use(helmet());
app.use(passport.initialize());
app.use(cookieParser());
app.use(apollo());

app.use(routes());

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

export default app;
