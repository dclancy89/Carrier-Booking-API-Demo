import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models';
import { Not, Repository } from 'typeorm';
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

  getAppointmentById(appointmentId: number) {
    return this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: {
        customer: true,
        carrier: true,
        pickup_location: true,
      },
    });
  }

  getAppointmentsForCustomer(userId: number) {
    return this.appointmentRepository.find({
      where: { customer_id: userId },
      relations: {
        customer: true,
        carrier: true,
        pickup_location: true,
      },
    });
  }

  getAppointmentsForCarrier(userId: number) {
    return this.appointmentRepository.find({
      where: {
        carrier_id: userId,
        appointment_status: Not(AppointmentStatus.DECLINED),
      },
      relations: {
        customer: true,
        carrier: true,
        pickup_location: true,
      },
    });
  }

  // This method checks which carriers have a location that
  // is within driving time to the pick up location before the appointment date/time
  // i.e. Does the carrier have a location where they can physically get to the pick up
  // location before the requested date/time.
  async getBookableCarriers(
    pickupLocationId: number,
    appointmentDateTime: Date,
  ) {
    const mapboxToken = this.configService.get('MAPBOX_TOKEN');
    const pickupLocation = await this.locationsService.findLocationById(
      pickupLocationId,
    );
    const carriersWithLocations = await this.usersService.getCarrierLocations();

    // Get the drive times from each carrier location to the pickup location
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

    // Check if the carrier has at least one location with a short enough drive time
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

    // Verify that the carrier is still able to fulfil the appointment window before creating appointment
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
    const savedAppointment = await this.appointmentRepository.save(appointment);
    return this.getAppointmentById(savedAppointment.id);
  }

  async updateAppointmentStatus(
    appointmentId: number,
    appointmentStatus: AppointmentStatus,
  ) {
    if (!Object.values(AppointmentStatus).includes(appointmentStatus)) {
      return 'Error: Not a valid appointment status';
    }
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
    appointment.appointment_status = appointmentStatus;
    await this.appointmentRepository.save(appointment);
    return await this.getAppointmentById(appointmentId);
  }
}
