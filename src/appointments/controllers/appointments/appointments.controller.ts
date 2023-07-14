import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

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

  @Post('book')
  bookAppointment(
    @Body() pickupLocationId: number,
    @Body() carrierId: number,
    @Body() appointmentDateTime: Date,
  ) {
    return this.appointmentsService.createAppointment(
      pickupLocationId,
      carrierId,
      appointmentDateTime,
    );
  }
}
