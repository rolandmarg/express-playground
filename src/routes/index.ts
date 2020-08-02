import { Router, RequestHandler, ErrorRequestHandler } from 'express';
import { authGuard, googleAuth, googleAuthCallback, cookieAuth } from '../auth';

const sendAuthInfo: RequestHandler = (req, res) => {
  res.send(req.user);
};

const notFound: RequestHandler = (_req, res) => {
  res.status(404).send('Not found');
};

const dreamCatcher: ErrorRequestHandler = (err, _req, res, next) => {
  console.error(err);
  res.status(500).send('Ooh!');
  next();
};

export const routes = () => {
  const router = Router();

  router.get('/auth/google', googleAuth);
  router.get('/auth/google/callback', googleAuthCallback, cookieAuth);
  router.get('/me', authGuard, sendAuthInfo);

  router.use(notFound);
  router.use(dreamCatcher);

  return router;
};
