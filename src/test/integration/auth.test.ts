import Iron from '@hapi/iron';
import {
  seal,
  unseal,
  sealResponse,
  unsealRequest,
  authGuard,
  cookieAuth,
  logout,
  Token,
} from '../../auth/helpers';
import env from '../../env';

const testUser = {
  id: 1,
  email: 'test@gmail.com',
};

jest.mock('../../env', () => ({
  COOKIE_MAX_AGE: '1s',
  TOKEN_MAX_AGE: '10ms',
  TOKEN_SECRET: 'Password string too short (min 32 characters required)',
}));

describe('Auth integration tests', () => {
  it('unsealRequest should throw when no token', async () => {
    const req = { cookies: {}, get: jest.fn() };

    await expect(unsealRequest(req as any)).rejects.toThrow();
  });

  it('unsealRequest should prioritize cookies over header', async () => {
    const token = await seal(testUser);
    const req = {
      cookies: {
        get sid() {
          return token;
        },
      },
      get: jest.fn(() => `Bearer ${token}`),
    };
    const cookieSpy = jest.spyOn(req.cookies, 'sid', 'get');

    await unsealRequest(req as any);

    expect(cookieSpy).toHaveBeenCalled();
    expect(req.get).not.toHaveBeenCalled();
  });

  it('unsealRequest should fall back to header when no cookie', async () => {
    const token = await seal(testUser);
    const req = {
      cookies: {
        get sid() {
          return;
        },
      },
      get: jest.fn(() => `Bearer ${token}`),
    };

    await unsealRequest(req as any);

    expect(req.get).toHaveBeenCalled();
  });

  it('unsealRequest should unseal auth header token', async () => {
    const token = await seal(testUser);
    const req = {
      cookies: {
        get sid() {
          return;
        },
      },
      get: jest.fn(() => `Bearer ${token}`),
    };

    const payload = await unsealRequest(req as any);

    expect(payload).toEqual(testUser);
  });

  it('unsealRequest should unseal cookie token', async () => {
    const token = await seal(testUser);
    const req = {
      cookies: {
        get sid() {
          return token;
        },
      },
    };

    const payload = await unsealRequest(req as any);

    expect(payload).toEqual(testUser);
  });

  it('sealResponse should set a token as cookie', async () => {
    const res = { cookie: jest.fn() };

    await expect(sealResponse(res as any, testUser)).resolves.not.toThrow();

    expect(res.cookie).toHaveBeenCalled();

    const cookieName = res.cookie.mock.calls[0][0];
    const token = res.cookie.mock.calls[0][1];
    const payload = await unseal(token);

    expect(cookieName).toBe('sid');
    expect(payload).toEqual(testUser);
  });

  it('authGuard should throw on no token', async () => {
    const req = {
      cookies: {
        get sid() {
          return;
        },
      },
    };
    const next = jest.fn();

    await expect(authGuard(req as any, null as any, next)).rejects.toThrow();

    expect(next).not.toHaveBeenCalled();
  });

  it('authGuard should throw on no payload', async () => {
    const token: Token = {
      createdAt: Date.now(),
      payload: null,
    };
    const sealedToken = await Iron.seal(token, env.TOKEN_SECRET, Iron.defaults);

    const req = {
      cookies: {
        get sid() {
          return sealedToken;
        },
      },
    };
    const next = jest.fn();

    await expect(authGuard(req as any, null as any, next)).rejects.toThrow();

    expect(next).not.toHaveBeenCalled();
  });

  it('authGuard should set user and call next() when cookie present', async () => {
    const token = await seal(testUser);
    const req = {
      _user: null,

      set user(value: any) {
        this._user = value;
      },
      cookies: {
        get sid() {
          return token;
        },
      },
    };
    const userSpy = jest.spyOn(req, 'user', 'set');
    const next = jest.fn();

    await expect(
      authGuard(req as any, null as any, next)
    ).resolves.not.toThrow();

    expect(next).toHaveBeenCalled();
    expect(userSpy).toHaveBeenCalled();
    expect(req._user).toEqual(testUser);
  });

  it('authGuard should set user and call next() when auth header present', async () => {
    const token = await seal(testUser);
    const req = {
      _user: null,

      set user(value: any) {
        this._user = value;
      },
      cookies: {
        get sid() {
          return;
        },
      },
      get: jest.fn(() => `Bearer ${token}`),
    };
    const userSpy = jest.spyOn(req, 'user', 'set');
    const next = jest.fn();

    await expect(
      authGuard(req as any, null as any, next)
    ).resolves.not.toThrow();

    expect(next).toHaveBeenCalled();
    expect(req.get).toHaveBeenCalled();
    expect(userSpy).toHaveBeenCalled();
    expect(req._user).toEqual(testUser);
  });

  it('cookieAuth should set cookie and redirect', async () => {
    const req = { user: testUser };
    const res = { cookie: jest.fn(), redirect: jest.fn() };

    await expect(cookieAuth(req as any, res as any)).resolves.not.toThrow();

    expect(res.cookie).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();

    const cookieName = res.cookie.mock.calls[0][0];
    const token = res.cookie.mock.calls[0][1];
    const payload = await unseal(token);

    expect(cookieName).toBe('sid');
    expect(payload).toEqual(testUser);
  });

  it('logout should clear cookie and redirect', async () => {
    const res = { clearCookie: jest.fn(), redirect: jest.fn() };

    await expect(logout(null as any, res as any)).resolves.not.toThrow();

    expect(res.clearCookie).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();

    const cookieName = res.clearCookie.mock.calls[0][0];
    expect(cookieName).toBe('sid');
  });
});
