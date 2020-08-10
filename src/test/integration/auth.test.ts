import supertest from 'supertest';
import app from '../../app';
import { connect, close } from '../../db';
import { sleep, TOKEN_MAX_AGE_IN_MS } from '../../utils';
import { getManager } from 'typeorm';
import { Provider } from '../../entity/Provider';
import { User } from '../../entity/User';

const testUser = {
  id: 1,
  email: 'test@gmail.com',
};
const testProvider = new Provider();

testProvider.provider = 'test';
testProvider.providerId = '123';
testProvider.email = testUser.email;
testProvider.accessToken = 'testAccess';

jest.mock('../../auth/providers/google', () => ({
  googleAuth: jest.fn((_req, _res, next) => {
    next();
  }),
  googleAuthCallback: jest.fn((req, _res, next) => {
    req.user = testProvider;

    next();
  }),
}));

jest.mock('../../auth/providers/linkedin', () => ({
  linkedinAuth: jest.fn((_req, _res, next) => {
    next();
  }),
  linkedinAuthCallback: jest.fn((req, _res, next) => {
    req.user = testProvider;

    next();
  }),
}));

describe('Auth API', () => {
  let req: ReturnType<typeof supertest>;
  let agent: ReturnType<typeof supertest.agent>;

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    req = supertest(app);
    agent = supertest.agent(app);

    await getManager().delete(Provider, {});
    await getManager().delete(User, {});
  });

  it('/secret should return 401 without auth', async () => {
    const res = await req.get('/secret');

    expect(res.status).toBe(401);
  });

  it('/auth/google/callback should set auth cookie and redirect', async () => {
    const res = await req.get('/auth/google/callback');

    expect(res.status).toBe(302);
    expect(res.header['set-cookie'][0]).toContain('sid');
    expect(res.header['set-cookie'][0]).toContain('HttpOnly');
  });

  it('/auth/linkedin/callback should set auth cookie and redirect', async () => {
    const res = await req.get('/auth/linkedin/callback');

    expect(res.status).toBe(302);
    expect(res.header['set-cookie'][0]).toContain('sid');
    expect(res.header['set-cookie'][0]).toContain('HttpOnly');
  });

  it('/secret should accept cookies', async () => {
    await agent.get('/auth/google/callback');

    const res = await agent.get('/secret');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: testUser.email });
  });

  it('/secret should accept Authorization header', async () => {
    let res = await req.get('/auth/google/callback');

    const rawCookie = res.header['set-cookie'][0];

    const token = rawCookie.substring(
      rawCookie.indexOf('=') + 1,
      rawCookie.indexOf(';')
    );

    res = await req.get('/secret').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: testUser.email });
  });

  it('/logout should clear cookie', async () => {
    await agent.get('/auth/google/callback');
    await agent.get('/logout');

    const res = await agent.get('/secret');

    expect(res.status).toBe(401);
  });

  it('/secret should return 401 after token expires', async () => {
    await agent.get('/auth/google/callback');

    await sleep(TOKEN_MAX_AGE_IN_MS);

    const res = await agent.get('/secret');

    expect(res.status).toBe(401);

    expect(res.text).toBe('Token expired');
  });
});
