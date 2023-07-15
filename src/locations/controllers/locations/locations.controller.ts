import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { LocationsService } from 'src/locations/services/locations/locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  getLocations() {
    return this.locationsService.getLocations();
  }

  @Get('id/:id')
  findLocationsById(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findLocationById(id);
  }

  @Get('user/:userId')
  getLocationsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.locationsService.getLocationsByUserId(userId);
  }
}
