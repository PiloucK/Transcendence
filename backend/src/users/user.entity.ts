import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

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
