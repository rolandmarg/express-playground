import { getRepository } from 'typeorm';
import { Provider } from './entity';

export * from './entity';

export function getProviderRepo() {
  return getRepository(Provider);
}
