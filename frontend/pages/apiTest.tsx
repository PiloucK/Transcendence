import { useState, useEffect } from "react";
import UserProfile from "../components/UserProfile";
import userService from "../services/users";

const FetchUser = ({ user, addUser, getUser }) => {
  if (user.username === "Username") {
    return (
      <div>
        <button onClick={() => addUser("sirius", "pass")}>
          add user "sirius" with pass "pass"
        </button>
        <br />
        <button onClick={getUser}>get user "sirius"</button>
      </div>
    );
  }
  return <UserProfile user={user} />;
};

const app = () => {
  const sampleUser = {
    username: "Username",
    elo: 42,
    games_won: 21,
    games_lost: 21,
  };
  const [user, setUser] = useState(sampleUser);

  const getUser = () => {
    userService.getOne("sirius").then((user) => {
      setUser(user);
    });
  };

  const addUser = (login: string, pass: string) => {
    userService.add({ login: login, pass: pass }).then((user) => {
      setUser(user);
    });
  };

  return (
    <div>
      <FetchUser user={user} addUser={addUser} getUser={getUser} />
    </div>
  );
};

export default app;
