import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()
const baseUrl = `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/auth`;

axios.defaults.withCredentials = true;

const getLoggedInUser = () => {
  const request = axios.get(`${baseUrl}/getLoggedInUser`); // store the url in variable
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  getLoggedInUser,
};
