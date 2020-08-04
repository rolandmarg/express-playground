import ms from 'ms';
import { seal, unseal } from '../../auth/helpers';
import env from '../../env';
import { sleep } from '../../utils';

const testUser = {
  id: 1,
  email: 'test@gmail.com',
};

jest.mock('../../env', () => ({
  TOKEN_MAX_AGE: '10ms',
  TOKEN_SECRET: 'Password string too short (min 32 characters required)',
}));

describe('Auth unit tests', () => {
  it('seal should throw on no payload', async () => {
    await expect(seal(null as any)).rejects.toThrow();
  });

  it('seal should return token', async () => {
    const token = await seal(testUser);

    expect(typeof token).toBe('string');
  });

  it('unseal should return sealed object', async () => {
    const token = await seal(testUser);

    const payload = await unseal(token);

    expect(payload).toEqual(testUser);
  });

  it('unseal should throw on expired token', async () => {
    const token = await seal(testUser);

    await sleep(ms(env.TOKEN_MAX_AGE));

    await expect(unseal(token)).rejects.toThrow('Session expired');
  });
});
