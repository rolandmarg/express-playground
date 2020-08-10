import {
  Resolver,
  Query,
  Arg,
  ArgsType,
  Field,
  Args,
  Mutation,
  ID,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { Meeting, MeetingConnection } from './entity';
import { getPaginated } from './repository';
import { ConnectionArgs } from '../graphql/args';

@ArgsType()
class MeetingsArgs extends ConnectionArgs {
  @Field({ nullable: true })
  fromDate?: Date;
}

@ArgsType()
class CreateMeetingArgs {
  @Field()
  title!: string;

  @Field()
  startsAt!: Date;

  @Field()
  endsAt!: Date;
}

@Resolver()
export class MeetingResolver {
  constructor(private readonly meetingRepo = getRepository(Meeting)) {}

  @Query(() => Meeting, { nullable: true })
  async meeting(@Arg('id', () => ID) id: number) {
    const meeting = await this.meetingRepo.findOne(id);

    return meeting;
  }

  @Query(() => MeetingConnection)
  async meetings(@Args() { after, first }: MeetingsArgs) {
    const meetingConnection = await getPaginated({
      first,
      after,
    });

    return meetingConnection;
  }

  @Mutation(() => Meeting)
  async createMeeting(@Args() { title, startsAt, endsAt }: CreateMeetingArgs) {
    const meeting = new Meeting();

    meeting.title = title;
    meeting.startsAt = new Date(startsAt);
    meeting.endsAt = new Date(endsAt);

    await this.meetingRepo.save(meeting);

    return meeting;
  }

  @Mutation(() => Boolean)
  async deleteMeetings() {
    const result = await this.meetingRepo.delete({});

    return !!result.affected;
  }
}
