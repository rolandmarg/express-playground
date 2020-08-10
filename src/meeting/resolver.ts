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
import {
  getPaginated,
  Meeting,
  MeetingConnection,
  getMeetingRepo,
} from './repository';
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
  @Query(() => Meeting, { nullable: true })
  async meeting(@Arg('id', () => ID) id: number) {
    const meeting = await getMeetingRepo().findOne(id);

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

    await getMeetingRepo().save(meeting);

    return meeting;
  }

  @Mutation(() => Boolean)
  async deleteMeetings() {
    const result = await getMeetingRepo().delete({});

    return !!result.affected;
  }
}
