import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${process.env.NEXT_PUBLIC_HOST}\
:${process.env.NEXT_PUBLIC_BACKEND_PORT}\
/user-status`;
axios.defaults.withCredentials = true;

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

export default {
  getAll,
};
