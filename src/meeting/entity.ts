import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Connection } from '../graphql/types';

@ObjectType()
@Entity({ name: 'meetings' })
export class Meeting {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Index()
  @Column()
  startsAt!: Date;

  @Field()
  @Column()
  endsAt!: Date;
}

@ObjectType()
export class MeetingConnection extends Connection(Meeting) {}
