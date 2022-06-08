import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/users`;
import { IUserCredentials } from "../interfaces/users";
axios.defaults.withCredentials = true;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getAllForLeaderboard = () => {
  const request = axios.get(`${baseUrl}?forLeaderboard=true`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getOne = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const addOne = (newUser: IUserCredentials) => {
  const request = axios.post(baseUrl, newUser);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

// dev
const deleteAll = () => {
  const request = axios.delete(baseUrl);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const deleteOne = (login: string) => {
  const request = axios.delete(`${baseUrl}/${login}`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserUsername = (login: string, username: string) => {
  const request = axios.patch(`${baseUrl}/${login}/username`, { username });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserImage = (login: string, image: File) => {
  const request = axios.patch(`${baseUrl}/${login}/image`, { image });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserGamesWon = (login: string, gamesWon: string) => {
  const request = axios.patch(`${baseUrl}/${login}/gamesWon`, { gamesWon });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserGamesLost = (login: string, gamesLost: string) => {
  const request = axios.patch(`${baseUrl}/${login}/gamesLost`, { gamesLost });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const sendFriendRequest = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/sendFriendRequest`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const cancelFriendRequest = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/cancelFriendRequest`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const acceptFriendRequest = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/acceptFriendRequest`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const declineFriendRequest = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/declineFriendRequest`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getUserFriends = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/friends`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getUserFriendRequestsReceived = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/friendRequestsReceived`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getUserFriendRequestsSent = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/friendRequestsSent`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getUserBlocked = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/blockedUsers`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const updateUserElo = (login: string, elo: number) => {
  const request = axios.patch(`${baseUrl}/${login}/elo`, { elo });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const removeFriend = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/removeFriend`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const getUserBlockedUsers = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/blockedUsers`);
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const blockUser = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/blockUser`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

const unblockUser = (login: string, friendLogin42: string) => {
  const request = axios.patch(`${baseUrl}/${login}/unblockUser`, {
    friendLogin42,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      console.error(e);
    });
};

export default {
  getAll,
  getAllForLeaderboard,
  getOne,
  addOne,
  deleteAll,
  deleteOne,
  blockUser,
  unblockUser,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getUserFriends,
  getUserFriendRequestsReceived,
  getUserFriendRequestsSent,
  getUserBlocked,
  updateUserElo,
  updateUserUsername,
  updateUserImage,
  updateUserGamesWon,
  updateUserGamesLost,
  getUserBlockedUsers,
};
