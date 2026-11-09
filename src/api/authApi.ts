import axios from 'axios';
import type { AuthUser } from '../types';

/**
 * Авторизация / деавторизация: только axios, без кодогенерации и thunk.
 * Состояние в Redux передается вручную из компонентов (dispatch setCredentials / clearCredentials).
 * Бэкенд держит сессию в cookie (req.session.userId) и возвращает { userId, login } без JWT.
 */

export interface LoginResponse {
  /** JWT отсутствует: сессия — cookie; токен сохраняем на случай, если бэкенд его добавит */
  token?: string;
  userId?: number;
  login?: string;
}

/** Результат loginRequest: пользователь гарантированно заполнен */
export interface LoginResult extends LoginResponse {
  user: AuthUser;
}

/** POST /api/auth/login — body: { "login", "passwordHash" } */
export async function loginRequest(login: string, password: string): Promise<LoginResult> {
  const response = await axios.post<LoginResponse>('/api/auth/login', {
    login,
    passwordHash: password,
  });
  // Бэкенд возвращает { userId, login } — собираем пользователя для Redux
  const data = response.data ?? {};
  return {
    ...data,
    user: { userId: data.userId ?? 0, login: data.login ?? login },
  };
}

/** POST /api/auth/logout — уничтожение серверной сессии */
export async function logoutRequest(): Promise<void> {
  await axios.post('/api/auth/logout');
}
