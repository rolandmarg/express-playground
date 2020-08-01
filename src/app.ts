import 'dotenv/config';
import 'reflect-metadata';
import express, { ErrorRequestHandler } from 'express';
import passport from 'passport';
import helmet from 'helmet';

import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { apollo } from './graphql/apollo';
import { createConnection } from 'typeorm';
import { UserEntity } from './entity/User';
import { CalendarEventEntity } from './entity/CalendarEvent';
import { sealResponse, authGuard } from './auth/helpers';
import { googleAuth, googleAuthCallback } from './auth';

createConnection({
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [UserEntity, CalendarEventEntity],
});

const app = express();

app.use(helmet());
app.use(passport.initialize());
app.use(cookieParser());
app.use(apollo());

app.get('/auth/google', googleAuth);
app.get('/auth/google/callback', googleAuthCallback, async (req, res) => {
  const user = req.user as UserEntity;
  await sealResponse(res, user);

  res.redirect('/secret');
});

app.get('/secret', authGuard, (req, res) => {
  res.send(req.user);
});

app.get('/', (_req, res) => res.send('hello world'));

app.use(function (_req, res) {
  res.status(404).send("Sorry can't find that!");
});

const dreamCatcher: ErrorRequestHandler = (err, _req, res, next) => {
  console.error(err);
  res.status(500).send('Ooh!');
  next();
};

app.use(dreamCatcher);

export default app;
