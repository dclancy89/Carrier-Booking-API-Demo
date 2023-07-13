import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DGEUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;
}
