import axios from "axios";

const baseUrl = `http://${process.env.HOST}\
:${process.env.BACKEND_PORT}\
/status`;

axios.defaults.withCredentials = true;

const remove = (socketId: string) => {
  return axios
    .delete(`${baseUrl}/${socketId}`)
    .then((response) => response.data);
};

export default {
  remove,
};
