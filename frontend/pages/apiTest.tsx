import { useState, useEffect } from "react";
import { UserProfile } from "../components/UserProfile";
import userService from "../services/users";
import IUser from "../interfaces/IUser"
import IUserCredentials from "../interfaces/IUserCredentials";
import IUserStats from "../interfaces/IUserStats";

interface IUserFetching {
  userStats: IUserStats;
  addUser_f: (login: string, secret: string) => void;
  getUser_f: () => void;
}

function FetchUser (userAccess: IUserFetching) {
  if (userAccess.userStats.username === "Username") {
    return (
      <div>
        <button onClick={() => userAccess.addUser_f("sirius", "pass")}>
          add user "sirius" with pass "pass"
        </button>
        <br />
        <button onClick={userAccess.getUser_f}>get user "sirius"</button>
      </div>
    );
  }
  return <UserProfile userStats={userAccess.userStats} />;
};

const app = () => {
  const sampleCredentials: IUserCredentials = {
    login: "Username",
    secret: "pass",
  }

  const sampleStats: IUserStats = {
    username: "Username",
    ranking: 42,
    elo: 42,
    gamesWon: 21,
    gamesLost: 21,
  }

  const sampleUser: IUser = {
    credentials: sampleCredentials,
    stats: sampleStats,
  };
  const [user, setUser] = useState(sampleUser);

  const getUser = () => {
    userService.getOne("sirius").then((user) => {
      setUser(user);
    });
  };

  const addUser = (login: string, secret: string) => {
    userService.add({ login: login, secret: secret }).then((user) => {
      setUser(user);
    });
  };

  const userAccess: IUserFetching = {
    userStats: sampleStats,
    addUser_f: addUser,
    getUser_f: getUser,
  }

  return (
    <div>
      <FetchUser userAccess={userAccess}/>
    </div>
  );
};

export default app;
