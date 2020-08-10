import { ObjectType, Field, ID } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../user/entity';

@ObjectType()
@Entity({ name: 'providers' })
@Index(['email', 'provider'], { unique: true })
export class Provider {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  providerId!: string;

  @Field()
  @Column()
  provider!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  accessToken!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fullName?: string;

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.providers, { onDelete: 'CASCADE' })
  user!: User;
}
