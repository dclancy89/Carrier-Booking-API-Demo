import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { LocationsService } from 'src/locations/services/locations/locations.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly locationsService: LocationsService,
    private readonly configService: ConfigService,
  ) {}

  async getBookableCarriers(
    pickupLocationId: number,
    appointmentDateTime: Date,
  ) {
    const mapboxToken = this.configService.get('MAPBOX_TOKEN');
    const directionsApiBaseUrl =
      'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/';
    const pickupLocation = await this.locationsService.findLocationById(
      pickupLocationId,
    );
    return { location: pickupLocation, appointmentDate: appointmentDateTime };
  }
}

// https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-88.0593495,42.1585546;-88.0476135,42.1418144?access_token=sk.eyJ1IjoiZGNsYW5jeTg5IiwiYSI6ImNsazFhN2JkeTA0NWszcXRpNmlzaTJjeTIifQ.QIX2W--FJfjFC_sKm1tT4w
// pk.eyJ1IjoiZGNsYW5jeTg5IiwiYSI6ImNsazE4Y2JqaDAzd2czbm54b2U5ZDVmMnAifQ.bjJQXqxuWeUVuRR1d2-aaw
