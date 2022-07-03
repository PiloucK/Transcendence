import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${process.env.NEXT_PUBLIC_HOST}\
:${process.env.NEXT_PUBLIC_BACKEND_PORT}\
/users`;
axios.defaults.withCredentials = true;

const getAllForLeaderboard = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const getOne = (login: string) => {
  return axios.get(`${baseUrl}/${login}`).then((response) => response.data);
};

const addOne = (login42: string) => {
  return axios.post(`${baseUrl}/${login42}`).then((response) => response.data);
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

const updateUserImage = (login: string, file: FormData) => {
  const request = axios.post(
    `${baseUrl}/${login}/image`,
    file,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
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
  getAllForLeaderboard,
  getOne,
  addOne,
  deleteAll,
  getUserFriends,
  getUserFriendRequestsSent,
  getUserFriendRequestsReceived,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  updateUserUsername,
  updateUserImage,
  getUserBlockedUsers,
  blockUser,
  unblockUser,
};
