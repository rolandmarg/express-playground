import { Repository, getRepository } from 'typeorm';
import { createTestClient } from 'apollo-server-testing';
import { connect, close, User } from '../../db';
import { apolloServer, queries } from '../../graphql';

jest.mock('../../env', () => ({
  DB_URL: 'postgresql://rem@localhost:5432/midnightest',
}));

const { query } = createTestClient(apolloServer);

describe('User e2e tests', () => {
  let userRepo: Repository<User>;

  beforeAll(async () => {
    await connect();
    userRepo = getRepository(User);
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await userRepo.clear();
  });

  it('should fetch all users', async () => {
    const email = 'test@gmail.com';
    await userRepo.save({ email });

    const res = await query({ query: queries.users });

    expect(res).toMatchSnapshot({
      data: {
        users: [
          {
            id: expect.any(String),
            createdAt: expect.any(String),
            email,
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
    const email = 'test@gmail.com';
    const user = await userRepo.save({ email });

    const res = await query({
      query: queries.user,
      variables: { id: user.id },
    });

    expect(res).toMatchSnapshot({
      data: {
        user: {
          id: expect.any(String),
          createdAt: expect.any(String),
          email,
        },
      },
    });
  });
});
