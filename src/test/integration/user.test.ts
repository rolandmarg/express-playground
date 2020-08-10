import { createTestClient } from 'apollo-server-testing';
import { connect, close } from '../../db';
import { apolloServer } from '../../graphql/apollo';
import * as ops from '../../graphql/operations';
import { getManager } from 'typeorm';
import { User } from '../../entity/User';

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

    const res = await query({ query: ops.usersQuery });

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
    const res = await query({ query: ops.usersQuery });

    expect(res).toMatchSnapshot();
  });

  it('should fetch specific user', async () => {
    const user = new User();
    user.email = 'test@gmail.com';

    await getManager().save(user);

    const res = await query({
      query: ops.userQuery,
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
