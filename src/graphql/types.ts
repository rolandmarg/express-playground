import { Field, ClassType, ObjectType, Int } from 'type-graphql';

@ObjectType()
class PageInfo {
  @Field({ nullable: true })
  endCursor?: string;

  @Field({ nullable: true })
  startCursor?: string;

  @Field()
  hasPreviousPage!: boolean;

  @Field()
  hasNextPage!: boolean;
}

export function Connection<T>(TClass: ClassType<T>) {
  @ObjectType(`${TClass.name}Edge`)
  abstract class Edge {
    @Field(() => TClass)
    node!: T;

    @Field()
    cursor!: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass {
    @Field(() => Int)
    totalCount!: number;

    @Field(() => [Edge])
    edges!: Edge[];

    @Field(() => PageInfo)
    pageInfo!: PageInfo;
  }

  return ConnectionClass;
}
