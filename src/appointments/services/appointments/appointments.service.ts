import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { LocationsService } from 'src/locations/services/locations/locations.service';
import { UsersService } from 'src/users/services/users/users.service';

import { getDriveTime } from 'src/appointments/utils/getDriveTime';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly locationsService: LocationsService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

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
        return diff > location.travelTime;
      });
    });

    return {
      location: pickupLocation,
      appointmentDate: appointmentDateTime,
      carriers: bookableCarriers,
    };
  }
}
