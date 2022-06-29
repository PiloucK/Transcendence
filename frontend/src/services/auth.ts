import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/auth`;

axios.defaults.withCredentials = true;

const getLoggedInUser = async () => {
  const response = await axios
    .get(`${baseUrl}/getLoggedInUser`);
  return response.data;
};

export default {
  getLoggedInUser,
};
