import ms from 'ms';
import { Request, RequestHandler } from 'express';
import env from '../env';
import { Unauthorized } from '../utils';

import { seal, unseal } from './iron';
import { userRepo, Provider } from '../db';

export const authRequest = async (req: Request) => {
  const cookieToken = req.cookies['sid'];
  const authBearerToken = req.get('Authorization')?.split(' ')[1];

  const token = cookieToken || authBearerToken;

  if (!token) {
    throw new Unauthorized('Token not found');
  }

  const payload = await unseal(token);

  if (!payload) {
    throw new Unauthorized();
  }

  return payload;
};

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const payload = await authRequest(req);

  req.user = payload;

  next();
};

export const sendSessionInfo: RequestHandler = (req, res) => {
  res.send(req.user);
};

export const createSession: RequestHandler = async (req, res) => {
  const provider = req.user as Provider;

  if (!provider.email) {
    throw new Unauthorized('Email not provided');
  }

  const user = await userRepo.upsertByProvider(provider);

  const token = await seal({ email: user.email });

  res.cookie('sid', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: ms(env.COOKIE_MAX_AGE),
  });

  res.redirect('/secret');
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie('sid', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  });

  res.redirect('/secret');
};
