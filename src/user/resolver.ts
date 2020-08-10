import { Resolver, Query, Arg, ID, Authorized } from 'type-graphql';
import { User, getUserRepo } from './repository';
import { CurrentUser } from '../utils';

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Query(() => User)
  async user(@Arg('id', () => ID) id: number) {
    const user = await getUserRepo().findOne(id);

    return user;
  }

  @Query(() => [User])
  async users() {
    const users = await getUserRepo().find();

    return users;
  }
}
