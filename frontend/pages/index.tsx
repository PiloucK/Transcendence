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
	console.log("FetchUser");
  if (userAccess.userStats.username === "Username") {
    return (
      <div>
        <button onClick={() => userAccess.addUser_f("sirius", "pass")}>
          add user "sirius" with pass "pass"
        </button>
        <br />
        <button onClick={() => userAccess.getUser_f()}>get user "sirius"</button>
      </div>
    );
  }
  return <UserProfile {...userAccess.userStats} />;
};

const app = () => {
	console.log("app");
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
	console.log("getUser");
    userService.getOne("sirius").then((currentUser:IUser) => {
      setUser(currentUser);
    });
  };

  const addUser = (login: string, secret: string) => {
	console.log("addUser", login, secret);
    userService.add({ login: login, secret: secret }).then((currentUser:IUser) => {
      setUser(currentUser);
    });
  };

  const userAccess: IUserFetching = {
    userStats: sampleStats,
    addUser_f: addUser,
    getUser_f: () => getUser(),
  }

  return (
    <div>
      <FetchUser {...userAccess}/>
    </div>
  );
};

export default app;
