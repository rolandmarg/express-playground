import { connect, close } from '../../db';
import { query } from '../../graphql/testClient';
import { userQuery, usersQuery } from '../operation';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entity';

describe('User operations', () => {
  let userRepo: Repository<User>;

  beforeAll(async () => {
    await connect();

    userRepo = getRepository(User);
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await userRepo.delete({});
  });

  it('should fetch all users', async () => {
    const user = userRepo.create();
    user.email = 'test@gmail.com';

    await userRepo.save(user);

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
    const user = userRepo.create();
    user.email = 'test@gmail.com';

    await userRepo.save(user);

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
