import Iron from '@hapi/iron';
import { AppError, Unauthorized } from './errors';
import { TOKEN_SECRET, TOKEN_MAX_AGE_IN_MS } from './env';

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
    sealedToken = await Iron.seal(token, TOKEN_SECRET, Iron.defaults);
  } catch (e) {
    throw new Unauthorized();
  }

  return sealedToken;
}

export async function unseal(sealedToken: string) {
  let token: Token;

  try {
    token = await Iron.unseal(sealedToken, TOKEN_SECRET, Iron.defaults);
  } catch (e) {
    throw new Unauthorized();
  }

  if (!token.createdAt || isNaN(token.createdAt)) {
    throw new Unauthorized();
  }

  const expiresAt = token.createdAt + TOKEN_MAX_AGE_IN_MS;

  if (Date.now() >= expiresAt) {
    throw new Unauthorized('Token expired');
  }

  if (!token.payload) {
    throw new Unauthorized('Invalid token');
  }

  return token.payload;
}
