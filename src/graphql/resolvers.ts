import type { Resolvers } from './types';
import { Meeting, User, getManager } from '../db';

export const resolvers: Resolvers = {
  Query: {
    async me(_parent, _args, context) {
      return context.user;
    },
    async user(_parent, args) {
      const user = await getManager().findOne(User, args.id);

      return user;
    },
    async users() {
      const users = await getManager().find(User);

      return users;
    },
    async meeting(_parent, args) {
      const meeting = await getManager().findOne(Meeting, args.id);

      return meeting;
    },
    async meetings() {
      const meetings = await getManager().find(Meeting);

      return meetings;
    },
  },
  Mutation: {
    async createMeeting(_parent, args) {
      const meeting = getManager().create(Meeting, {
        title: args.input.title,
        startsAt: args.input.startsAt,
        endsAt: args.input.endsAt,
      });

      await getManager().save(meeting);

      return { meeting };
    },
    async deleteMeetings() {
      const result = await getManager().delete(Meeting, {});

      return !!result.affected;
    },
  },
};
