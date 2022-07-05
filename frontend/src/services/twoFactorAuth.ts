import axios from "axios";
const baseUrl = `http://${process.env.NEXT_PUBLIC__HOST}\
:${process.env.NEXT_PUBLIC__BACKEND_PORT}\
/two-factor-auth`;

axios.defaults.withCredentials = true;

const generateQrCode = () => {
  return axios
    .post(`${baseUrl}/generate-qrcode`)
    .then((response) => response.data);
};

const turnOn = (authCode?: string) => {
  return axios
    .post(`${baseUrl}/turn-on`, { authCode })
    .then((response) => response.data);
};

const turnOff = () => {
  return axios.post(`${baseUrl}/turn-off`).then((response) => response.data);
};

const authenticate = (authCode: string) => {
  return axios
    .post(`${baseUrl}/authenticate`, { authCode })
    .then((response) => response.data);
};

const has2FaBeenAlreadySetUp = () => {
  return axios
    .get(`${baseUrl}/set-up`)
    .then((response) => response.data);
};

export default {
  generateQrCode,
  turnOn,
  turnOff,
  authenticate,
  has2FaBeenAlreadySetUp,
};
