import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/users`;
import { IUserCredentials } from "../interfaces/users";
axios.defaults.withCredentials = true;

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getOne = async (login: string) => {
  const response = await axios.get(`${baseUrl}/${login}`);
  return response.data;
};

const addOne = async (newUser: IUserCredentials) => {
  const response = await axios.post(baseUrl, newUser);
  return response.data;
};

// dev
const deleteAll = async () => {
  const response = await axios.delete(baseUrl);
  return response.data;
};

const updateUserUsername = async (login: string, username: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/username`, { username });
  return response.data;
};

const getUserFriends = async (login: string) => {
  const response = await axios
    .get(`${baseUrl}/${login}/friends`);
  return response.data;
};

const getUserFriendRequestsSent = async (login: string) => {
  const response = await axios
    .get(`${baseUrl}/${login}/friendRequestsSent`);
  return response.data;
};

const getUserFriendRequestsReceived = async (login: string) => {
  const response = await axios
    .get(`${baseUrl}/${login}/friendRequestsReceived`);
  return response.data;
};

const sendFriendRequest = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/sendFriendRequest`, {
      friendLogin42,
    });
  return response.data;
};

const cancelFriendRequest = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/cancelFriendRequest`, {
      friendLogin42,
    });
  return response.data;
};

const acceptFriendRequest = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/acceptFriendRequest`, {
      friendLogin42,
    });
  return response.data;
};

const declineFriendRequest = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/declineFriendRequest`, {
      friendLogin42,
    });
  return response.data;
};

const removeFriend = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/removeFriend`, {
      friendLogin42,
    });
  return response.data;
};

const getUserBlockedUsers = async (login: string) => {
  const response = await axios
    .get(`${baseUrl}/${login}/blockedUsers`);
  return response.data;
};

const blockUser = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/blockUser`, {
      friendLogin42,
    });
  return response.data;
};

const unblockUser = async (login: string, friendLogin42: string) => {
  const response = await axios
    .patch(`${baseUrl}/${login}/unblockUser`, {
      friendLogin42,
    });
  return response.data;
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
