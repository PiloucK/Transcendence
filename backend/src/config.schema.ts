import Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  FORTYTWO_APP_CLIENT_ID: Joi.string().required(),
  FORTYTWO_APP_CLIENT_SECRET: Joi.string().required(),
  FORTYTWO_APP_REDIRECT_URI: Joi.string().required(),
  JWT_ACCESSTOKEN_SECRET: Joi.string().required(),
  JWT_ACCESSTOKEN_EXPIRATION_TIME: Joi.number().required(),
  ACCESSTOKEN_COOKIE_NAME: Joi.string().required(),
  ACCESSTOKEN_COOKIE_PATH: Joi.string().required(),
  TWO_FACTOR_AUTH_APP_NAME: Joi.string().required(),

  FRONTEND_PORT: Joi.number().required(),
  BACKEND_PORT: Joi.number().required(),
  WEBSOCKETS_PORT: Joi.number().required(),
});
