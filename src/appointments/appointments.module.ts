import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './controllers/appointments/appointments.controller';
import { AppointmentsService } from './services/appointments/appointments.service';
import { LocationsModule } from 'src/locations/locations.module';
import { UsersModule } from 'src/users/users.module';

import { Appointment } from 'src/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    LocationsModule,
    UsersModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
