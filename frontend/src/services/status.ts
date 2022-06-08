import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/status`;

axios.defaults.withCredentials = true;

// dev
const add = (socketId: string, userLogin42: string) => {
  return axios
    .post(baseUrl, { socketId, userLogin42 })
    .then((response) => response.data);
};

const remove = (socketId: string) => {
  return axios
    .delete(`${baseUrl}/${socketId}`)
    .then((response) => response.data);
};

export default {
  add,
  remove,
};
