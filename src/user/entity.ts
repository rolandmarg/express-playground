import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Provider } from '../provider/entity';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => [Provider])
  @OneToMany(() => Provider, (provider) => provider.user)
  providers!: Provider[];
}
