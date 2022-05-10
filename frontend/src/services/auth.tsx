import axios from "axios";
const baseUrl = "http://0.0.0.0:3001/auth"; // use environment var for 0.0.0.0

axios.defaults.withCredentials = true;

const loginWith42 = () => {
  const request = axios.get(baseUrl); // store the url in variable
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getLoggedInUser = () => {
  const request = axios.get(`${baseUrl}/getLoggedInUser`); // store the url in variable
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  loginWith42,
  getLoggedInUser,
};
