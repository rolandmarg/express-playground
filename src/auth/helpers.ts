import { Request, RequestHandler } from 'express';
import { upsertByProvider } from '../user/repository';
import {
  Unauthorized,
  seal,
  unseal,
  NODE_ENV,
  COOKIE_MAX_AGE_IN_MS,
} from '../utils';
import { Provider } from '../provider/entity';
import { getRepository } from 'typeorm';
import { User } from '../user/entity';

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

  const user = await getRepository(User).findOne({
    where: { email: payload.email },
    relations: ['providers'],
  });

  if (!user) {
    throw new Unauthorized();
  }

  return user;
};

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const user = await authRequest(req);

  req.user = user;

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
