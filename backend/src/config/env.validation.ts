import * as Joi from 'joi';
import { DEFAULT_WEB_ORIGIN } from '@shared/constants/app.constants';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  CORS_ORIGIN: Joi.string().default(DEFAULT_WEB_ORIGIN),
  JWT_SECRET: Joi.string()
    .min(32)
    .default('change-this-development-secret-key'),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').default(''),
  CLOUDINARY_API_KEY: Joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET: Joi.string().allow('').default(''),
});
