import axios from "axios";
const baseUrl = "http://0.0.0.0:3001/users";
import { IUserCredentials } from "../interfaces/IUserCredentials";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getOne = (login: string) => {
  const request = axios.get(`${baseUrl}?login=${login}`);
  return request.then((response) => response.data);
};

const add = (newUser: IUserCredentials) => {
  const request = axios.post(`${baseUrl}/signup`, newUser);
  return request.then((response) => response.data);
};

const deleteOne = (login: string) => {
  const request = axios.delete(`${baseUrl}/${login}`);
  return request.then((response) => response.data);
};

const updateUserRanking = (login: string, ranking: number) => {
  const request = axios.patch(`${baseUrl}/${login}/ranking`, { ranking });
  return request.then((response) => response.data);
};

const changeUsername = (login: string, username: string) => {
  const request = axios.patch(`${baseUrl}/${login}/username`, { username });
  return request.then((response) => response.data);
};

export default {
  getAll,
  getOne,
  add,
  deleteOne,
  updateUserRanking,
  changeUsername,
};
// ES6 shorthand for
// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// };
