import { User } from 'src/users/user.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class UserStatus {
  @PrimaryColumn()
  socketId!: string;

  @ManyToOne(() => User, (user) => user.status)
  user!: User;
}
