import supertest from 'supertest';
import app from '../app';
import { googleAuth, googleAuthCallback } from '../auth/google';
import env from '../env';

//TODO increase coverage
//TODO some of these tests should be integration/unit

const testUser = {
  id: 1,
  email: 'test@gmail.com',
};

jest.mock('../auth/google', () => ({
  googleAuth: jest.fn((_req, _res, next) => {
    next();
  }),
  googleAuthCallback: jest.fn((req, _res, next) => {
    req.user = testUser;
    next();
  }),
}));

jest.mock('../env', () => ({
  COOKIE_MAX_AGE_IN_SECONDS: 1,
  TOKEN_MAX_AGE_IN_MS: 100,
  TOKEN_SECRET: 'Password string too short (min 32 characters required)',
}));

describe('API suite', () => {
  let req: ReturnType<typeof supertest>;
  let agent: ReturnType<typeof supertest.agent>;

  beforeEach(() => {
    req = supertest(app);
    agent = supertest.agent(app);
  });

  it('/non-existing-route should return 404', async () => {
    const res = await req.get('/non-existing-route');

    expect(res.status).toBe(404);
  });

  it('/secret should return 401', async () => {
    const res = await req.get('/secret');

    expect(res.status).toBe(401);
  });

  it('/auth/google should invoke googleAuth middleware', async () => {
    await req.get('/auth/google');

    expect(googleAuth).toHaveBeenCalled();
  });

  it('/auth/google/callback should set cookie and redirect', async () => {
    const res = await req.get('/auth/google/callback');

    expect(res.status).toBe(302);
    expect(googleAuthCallback).toHaveBeenCalled();
    expect(res.header['set-cookie'][0]).toContain('sid');
    expect(res.header['set-cookie'][0]).toContain('HttpOnly');
  });

  it('/secret should return 200 after signing in', async () => {
    await agent.get('/auth/google/callback');

    const res = await agent.get('/secret');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(testUser);
  });

  it('/secret should accept Authorization Bearer header', async () => {
    let res = await req.get('/auth/google/callback');

    const rawCookie = res.header['set-cookie'][0];

    const token = rawCookie.substring(
      rawCookie.indexOf('=') + 1,
      rawCookie.indexOf(';')
    );

    res = await req.get('/secret').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(testUser);
  });

  it('/secret should return 401 after signing out', async () => {
    await agent.get('/auth/google/callback');

    await agent.get('/logout');

    const res = await agent.get('/secret');

    expect(res.status).toBe(401);
  });

  it('/secret should return 401 after session expires', async () => {
    await agent.get('/auth/google/callback');

    await new Promise((resolve) =>
      setTimeout(async () => {
        const res = await agent.get('/secret');

        expect(res.status).toBe(401);
        resolve();
      }, env.TOKEN_MAX_AGE_IN_MS)
    );
  });
});
