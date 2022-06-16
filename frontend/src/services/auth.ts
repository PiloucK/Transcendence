import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/auth`;

axios.defaults.withCredentials = true;

// dev
const getToken = async (login42: string) => {
  const response = await axios
    .get(`${baseUrl}/getToken/${login42}`);
  return response.data;
};

const getLoggedInUser = async () => {
  const response = await axios
    .get(`${baseUrl}/getLoggedInUser`);
  return response.data;
};

export default {
  getToken,
  getLoggedInUser,
};
