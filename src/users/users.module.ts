import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';

import { DGEUser } from 'src/models';

@Module({
  imports: [TypeOrmModule.forFeature([DGEUser])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
