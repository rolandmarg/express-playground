import { createTestClient } from 'apollo-server-testing';
import { connect, close, Meeting, getManager } from '../../db';
import { apolloServer, queries, mutations } from '../../graphql';

jest.mock('../../env', () => ({
  DB_URL: 'postgresql://rem@localhost:5432/midnightest',
}));

const { query, mutate } = createTestClient(apolloServer);

describe('Meeting operations', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await getManager().clear(Meeting);
  });

  //TODO write different edge cases(literally), one edge, two edges, three edges + after used as date

  it('should fetch freshly created meeting from database', async () => {
    const meeting = new Meeting();
    meeting.title = 'testMeeting';
    meeting.startsAt = new Date();
    meeting.endsAt = new Date();

    await getManager().save(meeting);

    const res = await query({
      query: queries.meetings,
      variables: { first: 1 },
    });

    expect(res).toMatchSnapshot({
      data: {
        meetings: {
          edges: [
            {
              node: {
                id: expect.any(String),
                endsAt: expect.any(String),
                startsAt: expect.any(String),
                title: meeting.title,
              },
              cursor: expect.any(String),
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: expect.any(String),
            endCursor: expect.any(String),
          },
        },
      },
    });

    const edgeLength = res.data?.meetings.edges.length;
    const edgeCursor = res.data?.meetings.edges[0].cursor;
    const startCursor = res.data?.meetings.pageInfo.startCursor;
    const endCursor = res.data?.meetings.pageInfo.endCursor;

    expect(edgeLength).toBe(1);
    expect(edgeCursor).not.toBeUndefined();
    expect(edgeCursor).toBe(startCursor);
    expect(edgeCursor).toBe(endCursor);
  });

  it('should fetch empty list of meetings', async () => {
    const res = await query({
      query: queries.meetings,
      variables: { first: 1 },
    });

    expect(res).toMatchSnapshot();
  });

  it('should fetch specific meeting', async () => {
    const meeting = new Meeting();
    meeting.title = 'testMeeting';
    meeting.startsAt = new Date();
    meeting.endsAt = new Date();

    await getManager().save(meeting);

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
          title: meeting.title,
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

    const meeting = await getManager().findOne(Meeting, { title });

    expect(meeting).toBeDefined();
  });
});
