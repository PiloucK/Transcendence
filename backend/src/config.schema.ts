import Joi from 'joi';

export const configValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  DATABASE_CONTAINER_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
});
