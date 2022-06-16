import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/status`;

axios.defaults.withCredentials = true;

// dev
const add = async (socketId: string, userLogin42: string) => {
  const response = await axios
    .post(baseUrl, { socketId, userLogin42 });
  return response.data;
};

const remove = async (socketId: string) => {
  const response = await axios
    .delete(`${baseUrl}/${socketId}`);
  return response.data;
};

export default {
  add,
  remove,
};
