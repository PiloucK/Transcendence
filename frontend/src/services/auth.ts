import axios from "axios";

const baseUrl = `http://${process.env.NEXT_PUBLIC__HOST}\
:${process.env.NEXT_PUBLIC__BACKEND_PORT}\
/auth`;

axios.defaults.withCredentials = true;

// dev
const getToken = (login42: string) => {
  return axios
    .get(`${baseUrl}/getToken/${login42}`)
    .then((response) => response.data);
};

const getLoggedInUser = () => {
  return axios
    .get(`${baseUrl}/getLoggedInUser`)
    .then((response) => response.data);
};

export default {
  getToken,
  getLoggedInUser,
};
