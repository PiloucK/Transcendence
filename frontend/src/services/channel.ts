import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `http://${publicRuntimeConfig.HOST}\
:${publicRuntimeConfig.BACKEND_PORT}\
/channel`;
import { Message, ChannelCreation } from "../interfaces/users";
axios.defaults.withCredentials = true;

const createChannel = async (login: string, channelInfos: ChannelCreation) => {
  console.log("Create channel: ", channelInfos);
  const request = axios.patch(`${baseUrl}/${login}/createChannel`, {
    name: channelInfos.name,
    password: channelInfos.password,
    isPrivate: channelInfos.isPrivate,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const updateChannel = async (
  login: string,
  channelId: string,
  channelInfos: ChannelCreation
) => {
  const request = axios.patch(
    `${baseUrl}/${login}/updateChannel/${channelId}`,
    {
      name: channelInfos.name,
      password: channelInfos.password,
      isPrivate: channelInfos.isPrivate,
    }
  );
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const joinProtectedChannel = async (
  login: string,
  channelId: string,
  password: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/joinProtectedChannel`, {
    channelId,
    password,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const joinChannel = async (login: string, channelId: string) => {
  const request = axios.patch(`${baseUrl}/${login}/joinChannel`, {
    channelId,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    throw e;
  }
};

const inviteToChannel = async (
  login: string,
  channelId: string,
  userLogin42: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/inviteToChannel`, {
    channelId,
    userLogin42,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const leaveChannel = async (login: string, channelId: string) => {
  const request = axios.patch(`${baseUrl}/${login}/leaveChannel`, {
    channelId,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const muteAChannelUser = async (
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
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const banAChannelUser = async (
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
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const setAChannelAdmin = async (
  login: string,
  channelId: string,
  userLogin42: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/setAChannelAdmin`, {
    channelId,
    userLogin42,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const unsetAChannelAdmin = async (
  login: string,
  channelId: string,
  userLogin42: string
) => {
  const request = axios.patch(`${baseUrl}/${login}/unsetAChannelAdmin`, {
    channelId,
    userLogin42,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const sendMSGToChannel = async (
  login: string,
  channelId: string,
  message: Message
) => {
  const request = axios.patch(`${baseUrl}/${login}/sendMSGToChannel`, {
    channelId,
    message,
  });
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    if (e.response.status !== 403) {
      console.error(e);
    }
    throw e;
  }
};

const getChannelById = async (login: string, channelId: string) => {
  const request = axios.get(`${baseUrl}/${login}/channel/${channelId}`);
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const getChannelInvitableFriends = async (login: string, channelId: string) => {
  const request = axios.get(
    `${baseUrl}/${login}/channel/${channelId}/invitableFriends`
  );
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const getPublicChannels = async (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/publicChannels`);
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const getJoinedChannels = async (login: string) => {
  const request = axios.get(`${baseUrl}/${login}/joinedChannels`);
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export default {
  createChannel,
  updateChannel,
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
