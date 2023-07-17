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
}
