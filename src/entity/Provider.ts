import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'providers' })
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
  gender?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  displayName!: string;

  @Column({ nullable: true })
  fullName?: string;

  @ManyToOne(() => User, (user) => user.providers)
  user!: User;
}
