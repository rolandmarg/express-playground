import { getRepository } from 'typeorm';
import { Resolver, Query, Arg, ID, Authorized } from 'type-graphql';
import { User } from './entity';
import { CurrentUser } from '../utils';

@Resolver()
export class UserResolver {
  constructor(private readonly userRepo = getRepository(User)) {}

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Query(() => User)
  async user(@Arg('id', () => ID) id: number) {
    const user = await this.userRepo.findOne(id);

    return user;
  }

  @Query(() => [User])
  async users() {
    const users = await this.userRepo.find();

    return users;
  }
}
