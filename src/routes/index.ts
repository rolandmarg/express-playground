import { Router } from 'express';

import { googleAuth, googleAuthCallback } from '../auth/providers/google';
import { linkedinAuth, linkedinAuthCallback } from '../auth/providers/linkedin';
import {
  createSession,
  authMiddleware,
  sendSessionInfo,
  logout,
} from '../auth/session';

export const routes = () => {
  const router = Router();

  router.get('/auth/google', googleAuth);
  router.get('/auth/google/callback', googleAuthCallback, createSession);
  router.get('/auth/linkedin', linkedinAuth);
  router.get('/auth/linkedin/callback', linkedinAuthCallback, createSession);
  router.get('/secret', authMiddleware, sendSessionInfo);
  router.get('/logout', logout);

  return router;
};
