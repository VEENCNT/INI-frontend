import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import indicatorsReducer from '../features/indicators/indicatorsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    indicators: indicatorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
