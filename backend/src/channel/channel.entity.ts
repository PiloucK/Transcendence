import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Message } from './dto/channel.dto';

@Entity()
export class Channel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  isPrivate!: boolean;

  @Column()
  owner!: string;

  @Column('text', { array: true })
  admins!: string[];

  @Column('text', { array: true })
  muted!: string[];

  @Column('text', { array: true })
  banned!: string[];

  @Column('json', { array: true })
  messages!: Array<Message>;

  @Column('text', { array: true })
  invitations!: string[];

  // A many to many relation owned by the users.
}
