import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Invitation, Message } from './dto/privateConv.dto';

@Entity()
export class PrivateConv {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, (user) => user.privateConvs)
  userOne!: User;

  @ManyToOne(() => User, (user) => user.privateConvs)
  userTwo!: User;

	// I had to remove the {array: true} because it was causing an error
  @Column('json')
  messages!: (Message | Invitation)[];
}
