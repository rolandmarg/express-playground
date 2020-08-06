import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'meetings' })
export class Meeting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  startsAt!: Date;

  @Column()
  endsAt!: Date;
}
