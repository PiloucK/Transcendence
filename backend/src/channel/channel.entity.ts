import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Message } from './dto/channel.dto';

@Entity()
export class Channel {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  isPrivate!: boolean;

  @Column()
  owner!: string;

  @Column()
  admins!: string[];

  @Column()
  muted!: string[];

  @Column()
  banned!: string[];

  @Column()
  messages!: Array<Message>;

  @Column()
  invitations!: string[];

  // A many to many relation owned by the users.
}
