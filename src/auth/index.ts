import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import env from '../env';
import { Unauthorized } from '../utils';
import { User, Provider } from '../db';
import { unsealRequest, sealResponse } from './helpers';

export * from './helpers';

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

const upsertProvider = (providers: Provider[], provider: Provider) => {
  const existing = providers.find((p) => p.provider === provider.provider);
  if (!existing) {
    providers.push(provider);

    return providers;
  }

  existing.providerId = provider.providerId;
  existing.email = provider.email;
  existing.accessToken = provider.accessToken;
  existing.refreshToken = provider.refreshToken;
  existing.displayName = provider.displayName;
  existing.gender = provider.gender;
  existing.photo = provider.photo;
  existing.fullName = provider.fullName;

  return providers;
};

export async function cookieAuth(req: Request, res: Response) {
  const provider = req.user as Provider;

  if (!provider.email) {
    throw new Unauthorized('Email not provided');
  }

  let user = await getManager().findOne(
    User,
    { email: provider.email },
    { relations: ['providers'] }
  );

  if (!user) {
    user = new User();

    user.email = provider.email;
    user.providers = [provider];

    await getManager().transaction(async (transactionalManager) => {
      await transactionalManager.save(provider);
      await transactionalManager.save(user);
    });
  } else {
    user.providers = upsertProvider(user.providers, provider);

    user = await getManager().save(user);
  }

  await sealResponse(res, { email: user.email });

  res.redirect('/secret');
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('sid', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  });

  res.redirect('/secret');
}
