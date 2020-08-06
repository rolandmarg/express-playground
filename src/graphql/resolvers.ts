import type { Resolvers } from './types';
import { Meeting, User } from '../db';
import { getRepository } from 'typeorm';

export const resolvers: Resolvers = {
  Query: {
    async me(_parent, _args, context) {
      return context.user;
    },
    async user(_parent, args) {
      const user = await getRepository(User).findOne(args.id, {
        relations: ['providers'],
      });

      return user;
    },
    async users() {
      const users = await getRepository(User).find({
        relations: ['providers'],
      });

      return users;
    },
    async meeting(_parent, args) {
      const meeting = await getRepository(Meeting).findOne(args.id);

      return meeting;
    },
    async meetings() {
      const meetings = await getRepository(Meeting).find();

      return meetings;
    },
  },
  Mutation: {
    async createMeeting(_parent, args) {
      const meeting = getRepository(Meeting).save({
        title: args.input.title,
        startsAt: args.input.startsAt,
        endsAt: args.input.endsAt,
      });

      return { meeting };
    },
    async deleteMeetings() {
      const result = await getRepository(Meeting).delete({});

      return !!result.affected;
    },
  },
};
