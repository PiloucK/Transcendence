import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/privateConv`;
import { Message } from "../interfaces/users";
axios.defaults.withCredentials = true;

const createPrivateConv = (login: string, friendLogin42: string) => {
  const request = axios.post(`${baseUrl}/${login}/${friendLogin42}`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const sendPrivateMessage = (login: string, dest: string, message: Message) => {
  const request = axios.patch(`${baseUrl}/sendPrivateMessage`, {
    senderLogin42: login,
    receiverLogin42: dest,
    message,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getPrivateConv = (login: string, friendLogin42: string) => {
  const request = axios.get(`${baseUrl}/getPrivateConv`, {
    login42: login,
    fLogin42: friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error("getPrivateConv", e);
    });
};

const getPrivateConvs = (login: string) => {
  const request = axios.get(`${baseUrl}/getPrivateConvs`, {
    login42: login,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  createPrivateConv,
  sendPrivateMessage,
  getPrivateConv,
  getPrivateConvs,
};
