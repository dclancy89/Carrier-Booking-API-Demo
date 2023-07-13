import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DGEUser } from 'src/models';
import { Repository } from 'typeorm';

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
}
