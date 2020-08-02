import { Router, ErrorRequestHandler } from 'express';
import { sealResponse, authGuard } from '../auth/helpers';
import { googleAuth, googleAuthCallback } from '../auth';
import { User } from '../entity';

export const routes = () => {
  const router = Router();

  router.get('/auth/google', googleAuth);
  router.get('/auth/google/callback', googleAuthCallback, async (req, res) => {
    await sealResponse(res, req.user as User);

    res.redirect('/secret');
  });

  router.get('/secret', authGuard, (req, res) => {
    res.send(req.user);
  });

  router.get('/', (_req, res) => res.send('hello world'));

  router.use(function (_req, res) {
    res.status(404).send("Sorry can't find that!");
  });

  const dreamCatcher: ErrorRequestHandler = (err, _req, res, next) => {
    console.error(err);
    res.status(500).send('Ooh!');
    next();
  };

  router.use(dreamCatcher);

  return router;
};
