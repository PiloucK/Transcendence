
import axios from "axios";

const baseUrl = `http://${process.env.NEXT_PUBLIC__HOST}\
:${process.env.NEXT_PUBLIC__BACKEND_PORT}\
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

const deleteInvitation = (inviterLogin42: string) => {
  return axios
    .delete(`${baseUrl}/${inviterLogin42}`)
    .then((response) => response.data);
};

export default {
  getForOneUser,
  sendInvitation,
  deleteInvitation,
};
