import app from '../app';
import supertest from 'supertest';

describe('API rest endpoints', () => {
  const req = supertest(app);

  it('should return 404 on nonexistent route', async () => {
    const res = await req.get('/non-existing-route');

    expect(res.status).toBe(404);
  });

  it('should return unauthorized on secret route', async () => {
    const res = await req.get('/secret');

    expect(res.status).toBe(401);
  });
});
