import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentStatus } from 'src/types';

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
}
