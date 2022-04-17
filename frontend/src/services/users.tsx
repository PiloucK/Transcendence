import axios from "axios";
const baseUrl = "http://localhost:3001/users";
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

export default { getAll, getOne, add, deleteOne };
// ES6 shorthand for
// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// };
