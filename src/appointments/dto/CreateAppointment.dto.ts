import { IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from 'src/types';

export class CreateAppointmentDto {
  @IsNotEmpty()
  appointment_date: Date;

  @IsNotEmpty()
  appointment_time: Date;

  @IsNotEmpty()
  customer_id: number;

  @IsNotEmpty()
  carrier_id: number;

  @IsNotEmpty()
  appointment_status: AppointmentStatus;
}
