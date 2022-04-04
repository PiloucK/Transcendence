import { FC } from "react";

interface IUserProfileProps {
  user: IUser;
}

interface IUser {
  username: string;
  ranking: number;
  elo: number;
  gamesWon: number;
  gamesLost: number;
}

export const UserProfile: FC<IUserProfileProps> = ({ user }: IUserProfileProps) => {
  return (
    <>
      <div>
        <h1>{user.username}</h1>
        <h2>Level {user.elo}</h2>
        <p>Ranking: {user.ranking}</p>
        <p>Games won: {user.gamesWon}</p>
        <p>Games lost: {user.gamesLost}</p>
        <button>Invite to play</button>
        <button>Add to friend</button>
      </div>
    </>
  );
};
