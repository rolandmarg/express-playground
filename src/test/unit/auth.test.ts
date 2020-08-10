import Iron from '@hapi/iron';
import {
  seal,
  unseal,
  sleep,
  TOKEN_MAX_AGE_IN_MS,
  TOKEN_SECRET,
} from '../../utils';

const testUser = {
  id: 1,
  email: 'test@gmail.com',
};

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

    await sleep(TOKEN_MAX_AGE_IN_MS);

    await expect(unseal(token)).rejects.toThrow('Token expired');
  });

  it('unseal should throw on malformed token', async () => {
    const niceToken1 = undefined;
    const niceToken2 = '';
    const niceToken3 = 'nice token';
    const niceToken4 = await Iron.seal({}, TOKEN_SECRET, Iron.defaults);
    const niceToken5 = await Iron.seal(
      { payload: 1 },
      TOKEN_SECRET,
      Iron.defaults
    );
    const niceToken6 = await Iron.seal(
      { payload: 1, createdAt: 'hehe' },
      TOKEN_SECRET,
      Iron.defaults
    );
    const niceToken7 = await Iron.seal(
      { payload: 1, createdAt: new Date() },
      TOKEN_SECRET,
      Iron.defaults
    );
    await expect(unseal(niceToken1 as any)).rejects.toThrow();
    await expect(unseal(niceToken2 as any)).rejects.toThrow();
    await expect(unseal(niceToken3 as any)).rejects.toThrow();
    await expect(unseal(niceToken4 as any)).rejects.toThrow();
    await expect(unseal(niceToken5 as any)).rejects.toThrow();
    await expect(unseal(niceToken6 as any)).rejects.toThrow();
    await expect(unseal(niceToken7 as any)).rejects.toThrow();
  });
});
