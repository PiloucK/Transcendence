import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.invitations)
  inviter!: User;

  @ManyToOne(() => User, (user) => user.invitations)
  invited!: User;
}
