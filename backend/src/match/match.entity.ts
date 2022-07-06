import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne(() => User, (user) => user.matches)
  user1!: User;

  @ManyToOne(() => User, (user) => user.matches)
  user2!: User;

  @Column()
  user1Points!: number;

  @Column()
  user2Points!: number;

  @Column()
  winnerLogin42!: string;
}
