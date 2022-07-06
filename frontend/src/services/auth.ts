import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/auth`;

axios.defaults.withCredentials = true;

const getLoggedInUser = () => {
  return axios
    .get(`${baseUrl}/getLoggedInUser`)
    .then((response) => response.data);
};

export default {
  getLoggedInUser,
};
