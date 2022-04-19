import { FC } from "react";
import { IUserStats } from "../interfaces/IUserStats";

export const UserProfile: FC<IUserStats> = (userStats: IUserStats) => {
  return (
    <>
      <h1>{userStats.username}</h1>
      <h2>Elo {userStats.elo}</h2>
      <p>Ranking: {userStats.ranking}</p>
      <p>Games won: {userStats.gamesWon}</p>
      <p>Games lost: {userStats.gamesLost}</p>
      <button>Invite to play</button>
      <button>Add to friend</button>
    </>
  );
};
