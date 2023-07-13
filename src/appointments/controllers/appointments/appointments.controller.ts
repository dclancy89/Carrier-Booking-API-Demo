import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppointmentsService } from 'src/appointments/services/appointments/appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('bookable/:locationId')
  getBookableCarriers(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Query('appointmentDate') appointmentDate: Date,
  ) {
    return this.appointmentsService.getBookableCarriers(
      locationId,
      appointmentDate,
    );
  }
}
