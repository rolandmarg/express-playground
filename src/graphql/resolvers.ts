import type { Resolvers } from './types';

export const resolvers: Resolvers = {
  Query: {
    async viewer(_parent, _args, context) {
      return context.user;
    },
    async user(_parent, args, context) {
      const user = await context.userRepo.findOne(args.id);

      return user;
    },
    async users(_parent, _args, context) {
      const users = await context.userRepo.find();

      return users;
    },
    async meeting(_parent, args, context) {
      const meeting = await context.meetingRepo.findOne(args.id);

      return meeting;
    },
    async meetings(_parent, _args, context) {
      const meetings = await context.meetingRepo.find();

      return meetings;
    },
  },
  Mutation: {
    async createMeeting(_parent, args, context) {
      const meeting = await context.meetingRepo.save({
        title: args.input.title,
        startsAt: args.input.startsAt,
        endsAt: args.input.endsAt,
      });

      return { meeting };
    },
    async deleteMeetings(_parent, _args, context) {
      const result = await context.meetingRepo.delete({});

      return !!result.affected;
    },
  },
};
