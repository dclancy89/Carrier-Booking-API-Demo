import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DGEUser } from 'src/models';
import { Repository } from 'typeorm';

import { UserType } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(DGEUser)
    private readonly userRepository: Repository<DGEUser>,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  findUsersById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  getCarriers() {
    return this.userRepository.find({ where: { type: UserType.CARRIER } });
  }

  getCarrierLocations() {
    return this.userRepository.find({
      where: { type: UserType.CARRIER },
      relations: { locations: true },
    });
  }
}
