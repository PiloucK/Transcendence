import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Message, restriction } from './dto/channel.dto';

@Entity()
export class Channel {
	@PrimaryGeneratedColumn('uuid')
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

  @Column('text')
  muted!: restriction[];

  @Column('text')
  banned!: restriction[];

  @Column('json')
  messages!: Array<Message>;

  @Column('text', { array: true })
  invitations!: string[];

  @ManyToMany(() => User)
  @JoinTable()
  users!: User[];
}
