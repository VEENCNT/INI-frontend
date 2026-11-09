import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

function loadInitialState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY);
  let user: AuthUser | null;
  try {
    user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
  } catch {
    user = null;
  }
  return {
    user,
    token,
    // Сессия восстанавливается после обновления страницы, если известен пользователь
    // (токен может отсутствовать при cookie-сессии — запросы пойдут с cookie через прокси)
    isAuthenticated: Boolean(user),
    loading: false,
    error: null,
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // Состояние после авторизации передается вручную (без thunk)
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; token?: string | null }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.isAuthenticated = true;
      state.error = null;
      if (action.payload.token) {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    // Возврат интерфейса в состояние гостя
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setLoading, setError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
