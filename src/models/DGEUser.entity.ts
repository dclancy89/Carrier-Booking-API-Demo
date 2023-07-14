import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from 'src/types';
import { Location } from './Location.entity';

@Entity()
export class DGEUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: UserType;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];
}
