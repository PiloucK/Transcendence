import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${process.env.NEXT_PUBLIC_HOST}\
:${process.env.NEXT_PUBLIC_BACKEND_PORT}\
/privateConv`;
import { Message } from "../interfaces/Chat.interfaces";
axios.defaults.withCredentials = true;

const createPrivateConv = (login: string, friendLogin42: string) => {
  const request = axios.post(`${baseUrl}/${login}/${friendLogin42}`);
  return request
    .then((response) => response.data)
};

const sendPrivateMessage = (login: string, dest: string, message: Message) => {
  const request = axios.patch(`${baseUrl}/sendPrivateMessage`, {
    sender: login,
    receiver: dest,
    message,
  });
  return request
    .then((response) => response.data)
};

const getPrivateConv = (login: string, friendLogin42: string) => {
  const request = axios.get(`${baseUrl}/${login}/${friendLogin42}`);
  return request
    .then((response) => response.data)
};

const getPrivateConvs = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}`);
  return request
    .then((response) => response.data)
};

export default {
  createPrivateConv,
  sendPrivateMessage,
  getPrivateConv,
  getPrivateConvs,
};
