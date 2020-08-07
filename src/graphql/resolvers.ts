import type { Resolvers } from './types';
import { meetingRepo, getManager, User, Meeting } from '../db';

export const resolvers: Resolvers = {
  Query: {
    async me(_parent, _args, context) {
      const user = await getManager().findOne(User, {
        where: { email: context.auth.email },
        relations: ['providers'],
      });

      return user;
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
    async meetings(_parent, args) {
      const meetingsConnection = await meetingRepo.getPaginated({
        first: args.first,
        after: args.after,
      });

      return meetingsConnection;
    },
  },
  Mutation: {
    async createMeeting(_parent, args) {
      const meeting = new Meeting();

      meeting.title = args.input.title;
      meeting.startsAt = new Date(args.input.startsAt);
      meeting.endsAt = new Date(args.input.endsAt);

      await getManager().save(meeting);

      return { meeting };
    },
    async deleteMeetings() {
      const result = await getManager().delete(Meeting, {});

      return !!result.affected;
    },
  },
};
