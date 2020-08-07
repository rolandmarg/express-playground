import { User } from '../entity/User';
import { Provider } from '../entity/Provider';
import { getManager } from 'typeorm';

export const upsertByProvider = async (provider: Provider) => {
  let user = await getManager().findOne(User, {
    where: { email: provider.email },
  });

  if (!user) {
    user = new User();

    user.email = provider.email;
  } else {
    const existingProvider = await getManager().findOne(Provider, {
      where: {
        email: provider.email,
        provider: provider.provider,
      },
    });

    if (existingProvider) {
      // sorry for doing this
      provider.id = existingProvider.id;
    }
  }

  provider.user = user;

  await getManager().transaction(async (transactionalManager) => {
    await Promise.all([
      transactionalManager.save(provider),
      transactionalManager.save(user),
    ]);
  });

  return user;
};
