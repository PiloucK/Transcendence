import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()
const baseUrl = `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/auth`;

axios.defaults.withCredentials = true;

// dev
const getToken = (login42: string) => {
  const request = axios.get(`${baseUrl}/getToken/${login42}`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getLoggedInUser = () => {
  const request = axios.get(`${baseUrl}/getLoggedInUser`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  getToken,
  getLoggedInUser,
};
