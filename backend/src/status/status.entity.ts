import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserStatus {
  @PrimaryColumn()
  socketId!: string;
}
