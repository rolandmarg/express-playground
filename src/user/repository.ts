import { getRepository } from 'typeorm';
import { User } from './entity';
import { Provider } from '../provider/entity';

export async function upsertByProvider(provider: Provider) {
  const userRepo = getRepository(User);

  let user = await userRepo.findOne({
    where: { email: provider.email },
  });

  if (!user) {
    user = new User();

    user.email = provider.email;
  } else {
    const existingProvider = await userRepo.findOne({
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

  await userRepo.manager.transaction(async (transactionalManager) => {
    await Promise.all([
      transactionalManager.save(user),
      transactionalManager.save(provider),
    ]);
  });

  return user;
}
