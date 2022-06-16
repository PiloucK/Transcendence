import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/privateConv`;
import { Message } from "../interfaces/users";
axios.defaults.withCredentials = true;

const createPrivateConv = async (login: string, friendLogin42: string) => {
  const request = axios.post(`${baseUrl}/${login}/${friendLogin42}`);
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const sendPrivateMessage = async (login: string, dest: string, message: Message) => {
  const request = axios.patch(`${baseUrl}/sendPrivateMessage`, {
    sender: login,
    receiver: dest,
    message,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const getPrivateConv = async (login: string, friendLogin42: string) => {
  const request = axios.get(`${baseUrl}/${login}/${friendLogin42}`);
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error("getPrivateConv", e);
  }
};

const getPrivateConvs = async (login: string) => {
  const request = axios.get(`${baseUrl}/${login}`);
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export default {
  createPrivateConv,
  sendPrivateMessage,
  getPrivateConv,
  getPrivateConvs,
};
