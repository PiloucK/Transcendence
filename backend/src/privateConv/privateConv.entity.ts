import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class PrivateConv {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, (user) => user.privateConvs)
  userOne!: User;

  @ManyToOne(() => User, (user) => user.privateConvs)
  userTwo!: User;

  @Column()
  messages!: { author: string; content: string }[];
}
