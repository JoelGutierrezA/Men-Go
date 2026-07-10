export type AppRole = 'admin' | 'user';

export interface SeedUser {
  email: string;
  password: string;
  role: AppRole;
}

export interface AuthSession {
  email: string;
  role: AppRole;
}

export interface RegisteredUser {
  email: string;
  role: AppRole;
}
