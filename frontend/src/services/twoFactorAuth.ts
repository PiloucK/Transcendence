import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}\
  /two-factor-auth`;

axios.defaults.withCredentials = true;
console.log(baseUrl);

const generateQrCode = () => {
  return axios
    .get(`${baseUrl}/generate-qrcode`)
    .then((response) => response.data);
};

export default {
  generateQrCode,
};
