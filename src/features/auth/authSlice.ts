import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// После перезагрузки страницы (F5) стейт сбрасывается в состояние гостя;
// сессия пользователя при этом остаётся на сервере (cookie connect.sid).
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
    },
    // Возврат интерфейса в состояние гостя
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
