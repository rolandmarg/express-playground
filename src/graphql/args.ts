import { ArgsType, Int, Field } from 'type-graphql';
import { Min } from 'class-validator';

@ArgsType()
export class ConnectionArgs {
  @Field(() => Int, { defaultValue: 10 })
  @Min(1)
  first!: number;

  @Field({ nullable: true })
  after?: string;
}
