import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${process.env.NEXT_PUBLIC_HOST}\
:${process.env.NEXT_PUBLIC_BACKEND_PORT}\
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
