import type { Resolvers } from './types';
import { db } from '../db';

export const resolvers: Resolvers = {
  Query: {
    async me(_parent, _args, context) {
      return context.currentUser;
    },
    async meetings(_parent, { first, after }) {
      if (after) {
        return db.meetings.getPaginated({ first, after });
      } else {
        return db.meetings.getPaginated({ first });
      }
    },
  },
  Mutation: {
    async createMeeting(_parent, { input }) {
      return db.meetings.insert({
        title: input.title,
        endsAt: new Date(input.endsAt),
        startsAt: new Date(input.startsAt),
      });
    },
    async deleteMeetings() {
      await db.meetings.truncate();

      return true;
    },
  },
};
