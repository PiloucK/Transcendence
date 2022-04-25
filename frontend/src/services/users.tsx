import axios from "axios";
const baseUrl = "http://0.0.0.0:3001/users";
import { IUserCredentials } from "../interfaces/users";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getAllForLeaderboard = () => {
  const request = axios.get(`${baseUrl}?forLeaderboard=true`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getOne = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const addOne = (newUser: IUserCredentials) => {
  const request = axios.post(baseUrl, newUser);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const deleteOne = (login: string) => {
  const request = axios.delete(`${baseUrl}/${login}`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const sendFriendRequest = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/sendFriendRequest`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserElo = (login: string, elo: number) => {
  const request = axios.patch(`${baseUrl}/${login}/elo`, { elo });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserUsername = (login: string, username: string) => {
  const request = axios.patch(`${baseUrl}/${login}/username`, { username });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserGamesWon = (login: string, gamesWon: string) => {
  const request = axios.patch(`${baseUrl}/${login}/gamesWon`, { gamesWon });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserGamesLost = (login: string, gamesLost: string) => {
  const request = axios.patch(`${baseUrl}/${login}/gamesLost`, { gamesLost });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  getAll,
  getAllForLeaderboard,
  getOne,
  addOne,
  deleteOne,
  sendFriendRequest,
  updateUserElo,
  updateUserUsername,
  updateUserGamesWon,
  updateUserGamesLost,
};
// ES6 shorthand for
// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// };
