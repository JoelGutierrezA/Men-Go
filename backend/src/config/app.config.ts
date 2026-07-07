import { registerAs } from '@nestjs/config';
import { DEFAULT_WEB_ORIGIN } from '@shared/constants/app.constants';

const parseCorsOrigins = (value?: string): string[] => {
  if (!value?.trim()) {
    return [DEFAULT_WEB_ORIGIN];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
}));
