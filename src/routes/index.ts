import { Router, RequestHandler, ErrorRequestHandler } from 'express';
import {
  authGuard,
  cookieAuth,
  logout,
  googleAuth,
  googleAuthCallback,
} from '../auth';
import { AppError } from '../utils';

const sendAuthInfo: RequestHandler = (req, res) => {
  res.send(req.user);
};

const notFound: RequestHandler = (_req, res) => {
  res.status(404).send('Not found');
};

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

export const routes = () => {
  const router = Router();

  router.get('/auth/google', googleAuth);
  router.get('/auth/google/callback', googleAuthCallback, cookieAuth);
  router.get('/secret', authGuard, sendAuthInfo);
  router.get('/logout', logout);

  router.use(notFound);
  router.use(dreamCatcher);

  return router;
};
