import { Resolvers } from './types';

export const resolvers: Resolvers = {
  SignInResult: {
    __resolveType(parent) {
      if ('message' in parent) {
        return 'SignInError';
      }

      if ('user' in parent) {
        return 'SignInPayload';
      }

      return null;
    },
  },
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
    async calendarEvent(_parent, args, context) {
      const calendarEvent = await context.calendarEventRepo.findOne(args.id);

      return calendarEvent;
    },
    async calendarEvents(_parent, _args, context) {
      const calendarEvents = await context.calendarEventRepo.find();

      return calendarEvents;
    },
  },
  Mutation: {
    async createCalendarEvent(_parent, args, context) {
      const calendarEvent = await context.calendarEventRepo.save({
        title: args.input.title,
        startsAt: args.input.startsAt,
        endsAt: args.input.endsAt,
      });

      return { calendarEvent };
    },
    async deleteCalendarEvents(_parent, _args, context) {
      const result = await context.calendarEventRepo.delete({});

      return !!result.affected;
    },
  },
};
