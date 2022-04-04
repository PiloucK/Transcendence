import axios from "axios";
const baseUrl = "http://localhost:3001/users";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getOne = (id: number) => {
  const request = axios.get(`${baseUrl}?login=${id}`);
  return request.then((response) => response.data);
};

interface IUser {
  login: string;
  pass: string;
}
const add = (user: IUser) => {
  const request = axios.post(`${baseUrl}?login=${user.login}&pass=${user.pass}`);
  return request.then((response) => response.data);
};

const deleteOne = (id: number) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, getOne, add, deleteOne };
// ES6 shorthand for
// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// };
