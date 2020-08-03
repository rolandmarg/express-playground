import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
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
