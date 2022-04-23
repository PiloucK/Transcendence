import axios from "axios";
const baseUrl = "http://0.0.0.0:3001/users";
import { IUserCredentials } from "../interfaces/IUserCredentials";

const getAll = () => {
  const request = axios.get(baseUrl);
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

const add = (newUser: IUserCredentials) => {
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

const updateUserElo = (login: string, elo: number) => {
  const request = axios.patch(`${baseUrl}/${login}/elo`, { elo });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const changeUsername = (login: string, username: string) => {
  const request = axios.patch(`${baseUrl}/${login}/username`, { username });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  getAll,
  getOne,
  add,
  deleteOne,
  updateUserElo,
  changeUsername,
};
// ES6 shorthand for
// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// };
