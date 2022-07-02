import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.matches)
  userOne!: User;

  @ManyToOne(() => User, (user) => user.matches)
  userTwo!: User;

  @Column()
  userOnePoints!: number;

  @Column()
  userTwoPoints!: number;
}
