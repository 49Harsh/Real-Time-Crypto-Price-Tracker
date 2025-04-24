import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptoSlice';
import { wsMiddleware } from './wsMiddleware';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;