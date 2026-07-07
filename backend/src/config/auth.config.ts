import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret:
    process.env.JWT_SECRET ?? 'change-this-development-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
}));
