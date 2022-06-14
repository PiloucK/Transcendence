import { Channel } from 'src/channel/channel.entity';
import { PrivateConv } from 'src/privateConv/privateConv.entity';
import { UserStatus } from 'src/status/status.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  login42!: string;

  @Column()
  username!: string;
  // https://stackoverflow.com/questions/25300821/difference-between-varchar-and-text-in-mysql
  // https://typeorm.io/#column-data-types

  @Column({ default: 0 })
  elo!: number;

  @Column({ default: 0 })
  gamesWon!: number;

  @Column({ default: 0 })
  gamesLost!: number;

  @Column({ default: false })
  twoFa!: boolean; // make it private

  @Column({ default: false })
  online!: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  friends!: User[];

  @ManyToMany(() => User)
  @JoinTable()
  friendRequestsSent!: User[];

  @ManyToMany(() => User)
  @JoinTable()
  friendRequestsReceived!: User[];

  @ManyToMany(() => User)
  @JoinTable()
  blockedUsers!: User[];

  // Need to deeply test this part.
  @OneToMany(
    () => PrivateConv,
    (privateConv) =>
      privateConv.userOne === this ? privateConv.userOne : privateConv.userTwo,
  )
  privateConvs!: PrivateConv[];

  // There is a many to many relation owned by the channel.
  @ManyToMany(() => Channel)
  users!: Channel[];

  @OneToMany(() => UserStatus, (status) => status.user)
  status!: UserStatus[];
}

// photo

// export enum UserState {
//   IN_GAME = "IN_GAME",
//   IN_QUEUE = "IN_QUEUE",
//   IS_ONLINE = "IN_ONLINE",
//   IS_OFFLINE = "IS_OFFLINE"
// }

// export type Friends = Array<string>;
// export type FriendRequestsSent = Array<string>;
// export type FriendRequestsReceived = Array<string>;
// export type BlockedUsers = Array<string>;
