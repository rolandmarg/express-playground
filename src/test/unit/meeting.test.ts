import { decodeCursor, encodeCursor, isCursor } from '../../repository/meeting';

describe('Meeting unit tests', () => {
  it('encodeCursor should return string', () => {
    const id = 1;
    const startsAt = new Date();

    const cursor = encodeCursor({ id, startsAt });

    expect(typeof cursor).toBe('string');
  });

  it('isCursor should be truthy on encodeCursor result', async () => {
    const id = 1;
    const startsAt = new Date();

    const cursor = encodeCursor({ id, startsAt });

    expect(isCursor(cursor)).toBeTruthy();
  });

  it('isCursor should be false on random input', async () => {
    expect(isCursor('2020')).toBeFalsy();
    expect(isCursor('2020-10-10')).toBeFalsy();
    expect(isCursor('qwdqa')).toBeFalsy();
    expect(isCursor('20 2020')).toBeFalsy();
  });

  it('decodeCursor should return encodeCursor input', async () => {
    const id = 1;
    const startsAt = new Date();

    const cursor = encodeCursor({ id, startsAt });

    const { id: decodedId, startsAt: decodedStartsAt } = decodeCursor(cursor);

    expect(decodedId).toBe(id);
    expect(decodedStartsAt).toBe(startsAt.toISOString());
  });
});
