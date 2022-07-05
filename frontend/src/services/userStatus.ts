import axios from "axios";
const baseUrl = `http://${process.env.NEXT_PUBLIC__HOST}\
:${process.env.NEXT_PUBLIC__BACKEND_PORT}\
/user-status`;
axios.defaults.withCredentials = true;

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

export default {
  getAll,
};
