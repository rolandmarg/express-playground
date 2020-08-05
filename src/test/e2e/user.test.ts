import { createTestClient } from 'apollo-server-testing';
import { connect } from '../../db';
import { apolloServer, queries } from '../../graphql';

jest.mock('../../env', () => ({
  DB_URL: 'postgresql://rem@localhost:5432/midnightest',
}));

const { query } = createTestClient(apolloServer);

describe('User e2e tests', () => {
  beforeAll(async () => {
    await connect();
  });

  it('should fetch all users', async () => {
    const res = await query({ query: queries.users });

    expect(res).toMatchSnapshot();
  });
});
