import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/users`;
import { IUserCredentials } from "../interfaces/users";
axios.defaults.withCredentials = true;

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const getOne = (login: string) => {
  return axios.get(`${baseUrl}/${login}`).then((response) => response.data);
};

const addOne = (newUser: IUserCredentials) => {
  return axios.post(baseUrl, newUser).then((response) => response.data);
};

// dev
const deleteAll = () => {
  return axios.delete(baseUrl).then((response) => response.data);
};

const updateUserUsername = (login: string, username: string) => {
  return axios
    .patch(`${baseUrl}/${login}/username`, { username })
    .then((response) => response.data);
};

const getUserFriends = (login: string) => {
  return axios
    .get(`${baseUrl}/${login}/friends`)
    .then((response) => response.data);
};

const getUserFriendRequestsSent = (login: string) => {
  return axios
    .get(`${baseUrl}/${login}/friendRequestsSent`)
    .then((response) => response.data);
};

const getUserFriendRequestsReceived = (login: string) => {
  return axios
    .get(`${baseUrl}/${login}/friendRequestsReceived`)
    .then((response) => response.data);
};

const sendFriendRequest = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/sendFriendRequest`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

const cancelFriendRequest = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/cancelFriendRequest`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

const acceptFriendRequest = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/acceptFriendRequest`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

const declineFriendRequest = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/declineFriendRequest`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

const removeFriend = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/removeFriend`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

const getUserBlockedUsers = (login: string) => {
  return axios
    .get(`${baseUrl}/${login}/blockedUsers`)
    .then((response) => response.data);
};

const blockUser = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/blockUser`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

const unblockUser = (login: string, friendLogin42: string) => {
  return axios
    .patch(`${baseUrl}/${login}/unblockUser`, {
      friendLogin42,
    })
    .then((response) => response.data);
};

export default {
  getAll,
  getOne,
  addOne,
  deleteAll,
  updateUserUsername,
  getUserFriends,
  getUserFriendRequestsSent,
  getUserFriendRequestsReceived,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getUserBlockedUsers,
  blockUser,
  unblockUser,
};
