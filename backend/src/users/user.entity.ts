import { Exclude } from 'class-transformer';
import { Channel } from 'src/channel/channel.entity';
import { Invitation } from 'src/invitation/invitation.entity';
import { Match } from 'src/match/match.entity';
import { PrivateConv } from 'src/privateConv/privateConv.entity';
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

  @Column({ unique: true, nullable: true })
  username!: string;
  // https://stackoverflow.com/questions/25300821/difference-between-varchar-and-text-in-mysql
  // https://typeorm.io/#column-data-types

  @Column()
  photo42!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ default: 800 })
  elo!: number;

  // @Column({ default: 0 })
  // @Exclude()
  // totalOpponentsEloCount!: number;

  @Column({ default: 0 })
  gamesWon!: number;

  @Column({ default: 0 })
  gamesLost!: number;

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

  @OneToMany(
    () => Match,
    (match) => (match.user1 === this ? match.user1 : match.user2),
  )
  matches!: Match[];

  @OneToMany(
    () => Invitation,
    (invitation) => (invitation.inviter === this ? invitation.inviter : invitation.invited),
  )
  invitations!: Invitation[];

  @Column({ default: false })
  isTwoFactorAuthEnabled!: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorAuthSecret!: string;

  @Column({ nullable: true })
  @Exclude()
  twoFactorAuthTemporarySecret!: string;
}
