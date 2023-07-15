import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { LocationsService } from 'src/locations/services/locations/locations.service';
import { UsersService } from 'src/users/services/users/users.service';

import { CreateAppointmentDto } from 'src/appointments/dto/CreateAppointment.dto';

import { AppointmentStatus } from 'src/types';

import { getDriveTime } from 'src/appointments/utils/getDriveTime';

// We give the carrier a 30 minute grace window on top of travel time
const bookingGraceTime = 30 * 60;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly locationsService: LocationsService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  getAppointmentsForCustomer(userId: number) {
    return this.appointmentRepository.find({ where: { customer_id: userId } });
  }

  async getBookableCarriers(
    pickupLocationId: number,
    appointmentDateTime: Date,
  ) {
    const mapboxToken = this.configService.get('MAPBOX_TOKEN');
    const pickupLocation = await this.locationsService.findLocationById(
      pickupLocationId,
    );
    const carriersWithLocations = await this.usersService.getCarrierLocations();

    const carriersWithTimes = await Promise.all(
      carriersWithLocations.map(async (carrier) => {
        const locations = await Promise.all(
          carrier.locations.map(async (location) => {
            const travelTime = await getDriveTime(
              pickupLocation,
              location,
              mapboxToken,
            );
            return { ...location, travelTime };
          }),
        );
        return {
          id: carrier.id,
          name: carrier.name,
          type: carrier.type,
          locations,
        };
      }),
    );

    const bookableCarriers = carriersWithTimes.filter((carrier) => {
      return carrier.locations.filter((location) => {
        const now = new Date();
        const diff =
          (new Date(appointmentDateTime).getTime() - now.getTime()) / 1000;
        return diff > location.travelTime + bookingGraceTime;
      });
    });

    return {
      location: pickupLocation,
      appointmentDate: appointmentDateTime,
      carriers: bookableCarriers,
    };
  }

  async createAppointment(
    pickupLocationId: number,
    carrierId: number,
    appointmentDateTime: Date,
  ) {
    const pickupLocation = await this.locationsService.findLocationById(
      pickupLocationId,
    );

    const carrierLocations = await this.locationsService.getLocationsByUserId(
      carrierId,
    );

    const mapboxToken = this.configService.get('MAPBOX_TOKEN');

    const driveTimes = await Promise.all(
      carrierLocations.map(async (location) => {
        return await getDriveTime(pickupLocation, location, mapboxToken);
      }),
    );

    const isBookable = !!driveTimes.filter((time) => {
      const now = new Date();
      const diff =
        (new Date(appointmentDateTime).getTime() - now.getTime()) / 1000;
      return diff > time + bookingGraceTime;
    }).length;

    if (!isBookable) {
      return 'Error';
    }

    const appointmentDto = new CreateAppointmentDto();
    appointmentDto.appointment_date = new Date(appointmentDateTime);
    appointmentDto.appointment_time = new Date(appointmentDateTime);
    appointmentDto.pickup_location_id = pickupLocation.id;
    appointmentDto.customer_id = pickupLocation.user_id;
    appointmentDto.carrier_id = carrierId;
    appointmentDto.appointment_status = AppointmentStatus.PENDING;

    const appointment = this.appointmentRepository.create(appointmentDto);
    return this.appointmentRepository.save(appointment);
  }
}
