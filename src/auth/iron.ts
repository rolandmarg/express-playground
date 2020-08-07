import ms from 'ms';
import Iron from '@hapi/iron';
import env from '../env';
import { AppError, Unauthorized } from '../utils/errors';

export interface Token {
  payload: any;
  createdAt: number;
}

export async function seal(payload: any) {
  if (!payload) {
    throw new AppError();
  }

  const token: Token = { payload, createdAt: Date.now() };

  let sealedToken: string;

  try {
    sealedToken = await Iron.seal(token, env.TOKEN_SECRET, Iron.defaults);
  } catch (e) {
    throw new Unauthorized();
  }

  return sealedToken;
}

export async function unseal(sealedToken: string) {
  let token: Token;

  try {
    token = await Iron.unseal(sealedToken, env.TOKEN_SECRET, Iron.defaults);
  } catch (e) {
    throw new Unauthorized();
  }

  if (!token.createdAt || isNaN(token.createdAt)) {
    throw new Unauthorized();
  }

  const expiresAt = token.createdAt + ms(env.TOKEN_MAX_AGE);

  if (Date.now() >= expiresAt) {
    throw new Unauthorized('Token expired');
  }

  if (!token.payload) {
    throw new Unauthorized('Invalid token');
  }

  return token.payload;
}
