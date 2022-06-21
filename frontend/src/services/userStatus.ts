import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/user-status`;
axios.defaults.withCredentials = true;

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

export default {
  getAll,
};
