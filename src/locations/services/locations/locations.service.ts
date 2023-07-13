import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/models';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  getLocations() {
    return this.locationRepository.find();
  }

  findLocationsById(id: number) {
    return this.locationRepository.findOne({ where: { id } });
  }
}
