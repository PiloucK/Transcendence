import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  login42!: string;

  @Column()
  token42!: string;

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
  twoFa!: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  friends!: User[];
}

// export interface IUserForLeaderboard {
//   login42: string; // peut-etre a retirer (seul identifiant unique qu'on passe au front)
//   username: string; // username qu'on peut changer (unique?)
//   //photo?
//   elo: number;
// }

// export interface IUserPublicInfos extends IUserForLeaderboard {
//   //photo?
//   gamesWon: number;
//   gamesLost: number;
// }

// export interface IUser extends IUserPublicInfos {
//   id: string; // uuid
//   token42: string; // token 42 (changer le nom)
//   friends: Array<string>;
//   friendRequestsSent: Array<string>;
//   friendRequestsReceived: Array<string>;
//   blockedUsers: Array<string>;
//   twoFa: boolean;
// }

// export type Friends = Array<string>;
// export type FriendRequestsSent = Array<string>;
// export type FriendRequestsReceived = Array<string>;
// export type BlockedUsers = Array<string>;
