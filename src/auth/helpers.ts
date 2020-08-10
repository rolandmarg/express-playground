import { Request, RequestHandler } from 'express';
import {
  Unauthorized,
  seal,
  unseal,
  COOKIE_MAX_AGE_IN_MS,
  NODE_ENV,
} from '../utils';
import { getManager } from 'typeorm';
import { User } from '../entity/User';
import { Provider } from '../entity/Provider';
import { upsertByProvider } from '../repository/user';

export const authRequest = async (req: Request) => {
  const cookieToken = req.cookies['sid'];
  const authBearerToken = req.get('Authorization')?.split(' ')[1];

  const token = cookieToken || authBearerToken;
  if (!token) {
    throw new Unauthorized('Token not found');
  }

  const payload = await unseal(token);

  if (!payload || !payload.email) {
    throw new Unauthorized();
  }

  const user = await getManager().findOne(User, {
    where: { email: payload.email },
    relations: ['providers'],
  });

  if (!user) {
    throw new Unauthorized();
  }

  return user;
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

  const user = await upsertByProvider(provider);

  const token = await seal({ email: user.email });

  res.cookie('sid', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE_IN_MS,
  });

  res.redirect('/secret');
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie('sid', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
  });

  res.redirect('/secret');
};
