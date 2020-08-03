import Iron from '@hapi/iron';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entity';
import { Unauthorized } from '../utils/errors';
import { TOKEN_SECRET, TOKEN_MAX_AGE, NODE_ENV, COOKIE_MAX_AGE } from '../env';
interface Token {
  user: User;
  createdAt: number;
}

export async function seal(user: User) {
  const token: Token = { user, createdAt: Date.now() };

  return Iron.seal(token, TOKEN_SECRET, Iron.defaults);
}

export async function unseal(sealedToken: string) {
  const token: Token = await Iron.unseal(
    sealedToken,
    TOKEN_SECRET,
    Iron.defaults
  );

  const expiresAt = token.createdAt + TOKEN_MAX_AGE;

  if (Date.now() >= expiresAt) {
    throw new Unauthorized('Session expired');
  }

  return token.user;
}

export async function sealResponse(res: Response, user: User) {
  const token = await seal(user);

  res.cookie('sid', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
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

  const user = await unseal(token);

  return user;
}

export async function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const user = await unsealRequest(req);

  if (!user) {
    throw new Unauthorized();
  }

  req.user = user;

  next();
}

export async function cookieAuth(req: Request, res: Response) {
  await sealResponse(res, req.user as User);

  res.redirect('/secret');
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('sid', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
  });

  res.redirect('/secret');
}
