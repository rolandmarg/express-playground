import { connect, close } from '../../db';
import { query } from '../../graphql/testClient';
import { userQuery, usersQuery } from '../operation';
import { getUserRepo } from '../repository';

describe('User operations', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await getUserRepo().delete({});
  });

  it('should fetch all users', async () => {
    const user = getUserRepo().create();
    user.email = 'test@gmail.com';

    await getUserRepo().save(user);

    const res = await query({ query: usersQuery });

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
    const res = await query({ query: usersQuery });

    expect(res).toMatchSnapshot();
  });

  it('should fetch specific user', async () => {
    const user = getUserRepo().create();
    user.email = 'test@gmail.com';

    await getUserRepo().save(user);

    const res = await query({
      query: userQuery,
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
