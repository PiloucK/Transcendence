import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.matches)
  user1!: User;

  @ManyToOne(() => User, (user) => user.matches)
  user2!: User;

  @Column()
  user1Points!: number;

  @Column()
  user2Points!: number;
}
