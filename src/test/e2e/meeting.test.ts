import { createTestClient } from 'apollo-server-testing';
import { connect, close, Repository, getRepository, Meeting } from '../../db';
import { apolloServer, queries, mutations } from '../../graphql';

jest.mock('../../env', () => ({
  DB_URL: 'postgresql://rem@localhost:5432/midnightest',
}));

const { query, mutate } = createTestClient(apolloServer);

describe('Meeting e2e tests', () => {
  let meetingRepo: Repository<Meeting>;

  beforeAll(async () => {
    await connect();
    meetingRepo = getRepository(Meeting);
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await meetingRepo.clear();
  });

  it('should fetch all meetings', async () => {
    const title = 'testMeeting';
    await meetingRepo.save({ title, startsAt: new Date(), endsAt: new Date() });

    const res = await query({ query: queries.meetings });

    expect(res).toMatchSnapshot({
      data: {
        meetings: [
          {
            id: expect.any(String),
            endsAt: expect.any(String),
            startsAt: expect.any(String),
            title,
          },
        ],
      },
    });
  });

  it('should fetch empty list of meetings', async () => {
    const res = await query({ query: queries.meetings });

    expect(res).toMatchSnapshot();
  });

  it('should fetch specific meeting', async () => {
    const title = 'testMeeting';
    const meeting = await meetingRepo.save({
      title,
      startsAt: new Date(),
      endsAt: new Date(),
    });

    const res = await query({
      query: queries.meeting,
      variables: { id: meeting.id },
    });

    expect(res).toMatchSnapshot({
      data: {
        meeting: {
          id: expect.any(String),
          endsAt: expect.any(String),
          startsAt: expect.any(String),
          title,
        },
      },
    });
  });

  it('should create a new meeting', async () => {
    const title = 'testMeeting';
    const res = await mutate({
      mutation: mutations.createMeeting,
      variables: {
        title,
        startsAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
      },
    });

    expect(res).toMatchSnapshot({
      data: {
        createMeeting: {
          meeting: {
            id: expect.any(String),
            endsAt: expect.any(String),
            startsAt: expect.any(String),
            title,
          },
        },
      },
    });

    const newMeeting = await meetingRepo.findOne({ title });

    expect(newMeeting).toBeDefined();
  });
});
