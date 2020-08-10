import { Router } from 'express';

import { googleAuth, googleAuthCallback } from '../provider/google';
import { linkedinAuth, linkedinAuthCallback } from '../provider/linkedin';
import {
  createSession,
  authMiddleware,
  sendSessionInfo,
  logout,
} from './helpers';

export default () => {
  const router = Router();

  router.get('/auth/google', googleAuth);
  router.get('/auth/google/callback', googleAuthCallback, createSession);
  router.get('/auth/linkedin', linkedinAuth);
  router.get('/auth/linkedin/callback', linkedinAuthCallback, createSession);
  router.get('/secret', authMiddleware, sendSessionInfo);
  router.get('/logout', logout);

  return router;
};
