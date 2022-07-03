import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/invitation`;

axios.defaults.withCredentials = true;

const getForOneUser = (userLogin42: string) => {
  return axios
    .get(`${baseUrl}/${userLogin42}`)
    .then((response) => response.data);
};

const sendInvitation = (invitedLogin42: string) => {
  return axios
    .post(baseUrl, { invitedLogin42 })
    .then((response) => response.data);
};

const declineInvitation = (inviterLogin42: string) => {
  return axios
    .delete(`${baseUrl}/${inviterLogin42}`)
    .then((response) => response.data);
};

export default {
  getForOneUser,
  sendInvitation,
  declineInvitation,
};
