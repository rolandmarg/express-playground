import express from 'express';
import passport from 'passport';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import { apollo } from './graphql/apollo';
import { routes } from './routes';

const app = express();

app.use(helmet());
app.use(passport.initialize());
app.use(cookieParser());
app.use(apollo());

app.use(routes());

export default app;
