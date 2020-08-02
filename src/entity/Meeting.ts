import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Length, IsDate, MinDate, MaxDate } from 'class-validator';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 128)
  title: string;

  @Column()
  @IsDate()
  @MinDate(new Date('2020'))
  @MaxDate(new Date('2030'))
  startsAt: Date;

  @Column()
  @IsDate()
  @MinDate(new Date('2020'))
  @MaxDate(new Date('2030'))
  endsAt: Date;
}
