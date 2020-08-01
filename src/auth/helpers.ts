import Iron from '@hapi/iron';
import ms from 'ms';
import { unauthorized } from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../entity/User';

const tokenSecret = process.env.TOKEN_SECRET;
const tokenMaxAge = ms(process.env.TOKEN_MAX_AGE);

interface Token {
  user: UserEntity;
  createdAt: number;
}

export async function seal(user: UserEntity) {
  const token: Token = { user, createdAt: Date.now() };

  return Iron.seal(token, tokenSecret, Iron.defaults);
}

export async function sealResponse(res: Response, user: UserEntity) {
  const token = await seal(user);

  res.cookie('sid', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: ms(process.env.TOKEN_MAX_AGE),
  });
}

export async function unsealRequest(req: Request) {
  let token = req.cookies['sid'];

  if (!token) {
    token = req.get('Authorization')?.split(' ')[1];
  }

  if (!token) {
    throw unauthorized('Unauthorized');
  }

  const user = await unseal(token);

  return user;
}

export async function unseal(sealedToken: string) {
  const token: Token = await Iron.unseal(
    sealedToken,
    tokenSecret,
    Iron.defaults
  );

  const expiresAt = token.createdAt + tokenMaxAge;

  if (Date.now() > expiresAt) {
    throw unauthorized('UserEntity expired');
  }

  return token.user;
}

export async function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const user = await unsealRequest(req);

  if (!user) {
    throw unauthorized('Unauthorized');
  }

  req.user = user;

  next();
}
