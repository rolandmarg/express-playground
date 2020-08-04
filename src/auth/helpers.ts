import Iron from '@hapi/iron';
import ms from 'ms';
import { Request, Response, NextFunction } from 'express';
import { Unauthorized, AppError } from '../utils';
import env from '../env';

interface Token {
  payload: any;
  createdAt: number;
}

export async function seal(payload: any) {
  if (!payload) {
    throw new AppError();
  }

  const token: Token = { payload, createdAt: Date.now() };

  return Iron.seal(token, env.TOKEN_SECRET, Iron.defaults);
}

export async function unseal(sealedToken: string) {
  const token: Token = await Iron.unseal(
    sealedToken,
    env.TOKEN_SECRET,
    Iron.defaults
  );

  const expiresAt = token.createdAt + ms(env.TOKEN_MAX_AGE);

  if (Date.now() >= expiresAt) {
    throw new Unauthorized('Session expired');
  }

  return token.payload;
}

export async function sealResponse(res: Response, payload: any) {
  const token = await seal(payload);

  res.cookie('sid', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: ms(env.COOKIE_MAX_AGE),
  });
}

export async function unsealRequest(req: Request) {
  let token = req.cookies['sid'];

  if (!token) {
    token = req.get('Authorization')?.split(' ')[1];
  }

  if (!token) {
    throw new Unauthorized();
  }

  const payload = await unseal(token);

  return payload;
}

export async function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const payload = await unsealRequest(req);

  if (!payload) {
    throw new Unauthorized();
  }

  req.user = payload;

  next();
}

export async function cookieAuth(req: Request, res: Response) {
  await sealResponse(res, req.user);

  res.redirect('/secret');
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('sid', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  });

  res.redirect('/secret');
}
