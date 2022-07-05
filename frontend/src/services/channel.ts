import axios from "axios";
const baseUrl = `http://${process.env.NEXT_PUBLIC__HOST}\
:${process.env.NEXT_PUBLIC__BACKEND_PORT}\
/channel`;
import { Message, ChannelCreation } from "../interfaces/Chat.interfaces";
axios.defaults.withCredentials = true;

const createChannel = (login: string, channelInfos: ChannelCreation) => {
  const request = axios.post(`${baseUrl}/${login}/createChannel`, {
    name: channelInfos.name,
    setPassword: channelInfos.setPassword,
    password: channelInfos.password,
    isPrivate: channelInfos.isPrivate,
  });
  return request.then((response) => response.data);
};

const updateChannel = (
  login: string,
  channelId: string,
  channelInfos: ChannelCreation
) => {
  const request = axios.patch(
    `${baseUrl}/${login}/updateChannel/${channelId}`,
    {
      name: channelInfos.name,
      setPassword: channelInfos.setPassword,
      password: channelInfos.password,
      isPrivate: channelInfos.isPrivate,
    }
  );
  return request.then((response) => response.data);
};

const updateChannelImage = (
  login: string,
  channelId: string,
  file: FormData
) => {
  const request = axios.post(`${baseUrl}/${login}/image/${channelId}`, file);
  return request.then((response) => response.data);
};

const joinProtectedChannel = (
  login: string,
  channelId: string,
  password: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/joinProtectedChannel`, {
    channelId,
    password,
  });
  return request.then((response) => response.data);
};

const joinChannel = (login: string, channelId: string) => {
  const request = axios.patch(`${baseUrl}/${login}/joinChannel`, {
    channelId,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      throw e;
      // console.error(e);
    });
};

const inviteToChannel = (
  login: string,
  channelId: string,
  userLogin42: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/inviteToChannel`, {
    channelId,
    userLogin42,
  });
  return request.then((response) => response.data);
};

const leaveChannel = (login: string, channelId: string) => {
  const request = axios.patch(`${baseUrl}/${login}/leaveChannel`, {
    channelId,
  });
  return request.then((response) => response.data);
};

const muteAChannelUser = (
  login: string,
  channelId: string,
  userLogin42: string,
  duration: number
) => {
  const request = axios.patch(`${baseUrl}/${login}/muteAChannelUser`, {
    channelId,
    userLogin42,
    duration,
  });
  return request.then((response) => response.data);
};

const banAChannelUser = (
  login: string,
  channelId: string,
  userLogin42: string,
  duration: number
) => {
  const request = axios.patch(`${baseUrl}/${login}/banAChannelUser`, {
    channelId,
    userLogin42,
    duration,
  });
  return request.then((response) => response.data);
};

const setAChannelAdmin = (
  login: string,
  channelId: string,
  userLogin42: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/setAChannelAdmin`, {
    channelId,
    userLogin42,
  });
  return request.then((response) => response.data);
};

const unsetAChannelAdmin = (
  login: string,
  channelId: string,
  userLogin42: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/unsetAChannelAdmin`, {
    channelId,
    userLogin42,
  });
  return request.then((response) => response.data);
};

const sendMSGToChannel = (
  login: string,
  channelId: string,
  message: Message
) => {
  const request = axios.patch(`${baseUrl}/${login}/sendMSGToChannel`, {
    channelId,
    message,
  });
  return request
    .then((response) => response.data)
    .catch((e) => {
      if (e.response.status !== 403) {
        console.error(e);
      }
      throw e;
    });
};

const getChannelById = (login: string, channelId: string) => {
  const request = axios.get(`${baseUrl}/${login}/channel/${channelId}`);
  return request.then((response) => response.data);
};

const getChannelInvitableFriends = (login: string, channelId: string) => {
  const request = axios.get(
    `${baseUrl}/${login}/channel/${channelId}/invitableFriends`
  );
  return request.then((response) => response.data);
};

const getPublicChannels = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/publicChannels`);
  return request.then((response) => response.data);
};

const getJoinedChannels = (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/joinedChannels`);
  return request.then((response) => response.data);
};

export default {
  createChannel,
  updateChannel,
  updateChannelImage,
  joinProtectedChannel,
  joinChannel,
  inviteToChannel,
  leaveChannel,
  muteAChannelUser,
  banAChannelUser,
  setAChannelAdmin,
  unsetAChannelAdmin,
  sendMSGToChannel,
  getChannelById,
  getChannelInvitableFriends,
  getPublicChannels,
  getJoinedChannels,
};
