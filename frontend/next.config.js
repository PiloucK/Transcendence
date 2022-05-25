module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    HOST: process.env.HOST,
    WEBSOCKETS_PORT: process.env.WEBSOCKETS_PORT,
    BACKEND_PORT: process.env.BACKEND_PORT,
    ACCESSTOKEN_COOKIE_NAME: process.env.ACCESSTOKEN_COOKIE_NAME,
    ACCESSTOKEN_COOKIE_PATH: process.env.ACCESSTOKEN_COOKIE_PATH,
  },
};
