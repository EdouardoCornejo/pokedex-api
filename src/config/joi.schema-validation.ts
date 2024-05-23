import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  API_POKEMON_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('dev', 'prod').required(),
  DB_MONGODB_URI: Joi.string().uri().required(),
  DB_MONGODB_NAME: Joi.string(),
  PORT: Joi.number().default(3000),
});
