import { createTestClient } from 'apollo-server-testing';
import { connect, close, User, getManager } from '../../db';
import { apolloServer, queries } from '../../graphql';

jest.mock('../../env', () => ({
  DB_URL: 'postgresql://rem@localhost:5432/midnightest',
}));

const { query } = createTestClient(apolloServer);

describe('User operations', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await getManager().delete(User, {});
  });

  it('should fetch all users', async () => {
    const user = new User();
    user.email = 'test@gmail.com';

    await getManager().save(user);

    const res = await query({ query: queries.users });

    expect(res).toMatchSnapshot({
      data: {
        users: [
          {
            id: expect.any(String),
            createdAt: expect.any(String),
            email: user.email,
          },
        ],
      },
    });
  });

  it('should fetch empty list of users', async () => {
    const res = await query({ query: queries.users });

    expect(res).toMatchSnapshot();
  });

  it('should fetch specific user', async () => {
    const user = new User();
    user.email = 'test@gmail.com';

    await getManager().save(user);

    const res = await query({
      query: queries.user,
      variables: { id: user.id },
    });

    expect(res).toMatchSnapshot({
      data: {
        user: {
          id: expect.any(String),
          createdAt: expect.any(String),
          email: user.email,
        },
      },
    });

    expect(+res.data?.user.id).toBe(user.id);
  });
});
