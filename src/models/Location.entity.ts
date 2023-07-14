import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DGEUser } from './DGEUser.entity';
@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @ManyToOne(() => DGEUser, (user) => user.locations)
  @JoinColumn({ name: 'user_id' })
  user: DGEUser;
}
