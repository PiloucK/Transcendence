import axios from "axios";

const baseUrl = `http://${process.env.NEXT_PUBLIC__HOST}\
:${process.env.NEXT_PUBLIC__BACKEND_PORT}\
/match`;

axios.defaults.withCredentials = true;

const getForOneUser = (userLogin42: string) => {
  return axios
    .get(`${baseUrl}/${userLogin42}`)
    .then((response) => response.data);
};

// dev
const createMatch = (
  opponentLogin42: string,
  selfScore: number,
  opponentScore: number,
  winnerLogin42: string
) => {
  return axios
    .post(baseUrl, { opponentLogin42, selfScore, opponentScore, winnerLogin42 })
    .then((response) => response.data);
};

export default {
  getForOneUser,
  createMatch,
};
