import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'providers' })
@Index(['email', 'provider'], { unique: true })
export class Provider {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  providerId!: string;

  @Column()
  provider!: string;

  @Column()
  email!: string;

  @Column()
  accessToken!: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  fullName?: string;

  @ManyToOne(() => User, (user) => user.providers, { onDelete: 'CASCADE' })
  user!: User;
}
