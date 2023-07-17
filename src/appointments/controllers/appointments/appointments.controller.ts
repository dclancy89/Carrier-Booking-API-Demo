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
import { AppointmentStatus } from 'src/types';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('customer/:id')
  getAppointmentsForCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.getAppointmentsForCustomer(id);
  }

  @Get('carrier/:id')
  getAppointmentsForCarrier(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.getAppointmentsForCarrier(id);
  }

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
    @Body('pickupLocationId', ParseIntPipe) pickupLocationId: number,
    @Body('carrierId', ParseIntPipe) carrierId: number,
    @Body('appointmentDateTime') appointmentDateTime: Date,
  ) {
    return this.appointmentsService.createAppointment(
      pickupLocationId,
      carrierId,
      appointmentDateTime,
    );
  }

  @Post('update_status')
  updateAppointmentStatus(
    @Body('appointmentId', ParseIntPipe) appointmentId: number,
    @Body('appointmentStatus') appointmentStatus: AppointmentStatus,
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      appointmentId,
      appointmentStatus,
    );
  }
}
