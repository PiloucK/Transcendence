import Joi from 'joi';

export const configValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  ACCESSTOKEN_COOKIE_NAME: Joi.string().required(),
  ACCESSTOKEN_COOKIE_SAMESITE: Joi.string().required(),
  ACCESSTOKEN_COOKIE_PATH: Joi.string().required(),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  FRONTEND_PORT: Joi.number().required(),
  BACKEND_PORT: Joi.number().required(),
  WEBSOCKETS_PORT: Joi.number().required(),
});
