import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './controllers/appointments/appointments.controller';
import { AppointmentsService } from './services/appointments/appointments.service';

import { DGEUser } from 'src/models';

@Module({
  imports: [TypeOrmModule.forFeature([DGEUser])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
