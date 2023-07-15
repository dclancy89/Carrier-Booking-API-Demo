import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentStatus } from 'src/types';
import { DGEUser } from './DGEUser.entity';
import { Location } from './Location.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointment_date: Date;

  @Column()
  appointment_time: Date;

  @Column()
  pickup_location_id: number;

  @Column()
  customer_id: number;

  @Column()
  carrier_id: number;

  @Column()
  appointment_status: AppointmentStatus;

  @OneToOne(() => DGEUser)
  @JoinColumn({ name: 'id' })
  customer: DGEUser;

  @OneToOne(() => DGEUser)
  @JoinColumn({ name: 'id' })
  carrier: DGEUser;

  @OneToOne(() => Location)
  @JoinColumn({ name: 'id' })
  pickup_location: Location;
}
