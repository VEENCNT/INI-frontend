import axios from 'axios';
import type { AuthUser } from '../types';

export interface LoginResponse {
  token?: string;
  userId?: number;
  login?: string;
}

export interface LoginResult extends LoginResponse {
  user: AuthUser;
}

export async function loginRequest(login: string, password: string): Promise<LoginResult> {
  const response = await axios.post<LoginResponse>('/api/auth/login', {
    login,
    passwordHash: password,
  });
  const data = response.data ?? {};
  return {
    ...data,
    user: { userId: data.userId ?? 0, login: data.login ?? login },
  };
}

export async function logoutRequest(): Promise<void> {
  await axios.post('/api/auth/logout');
}
