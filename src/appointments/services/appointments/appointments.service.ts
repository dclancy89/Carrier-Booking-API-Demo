import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DGEUser } from 'src/models';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(DGEUser)
    private readonly userRepository: Repository<DGEUser>,
  ) {}

  findUsersById(id: any) {
    return this.userRepository.findOne(id);
  }
}
