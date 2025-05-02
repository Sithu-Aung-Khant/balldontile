'use client';

import { configureStore } from '@reduxjs/toolkit';
import teamsReducer from './features/teams/teamsSlice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

// Create a custom middleware to handle localStorage persistence
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // Save to localStorage whenever the state changes
  if (action.type?.startsWith('teams/')) {
    const state = store.getState();
    localStorage.setItem('reduxState', JSON.stringify(state));
  }

  return result;
};

// Function to load state from localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load state from localStorage');
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    teams: teamsReducer,
  },
  preloadedState:
    typeof window !== 'undefined' ? loadFromLocalStorage() : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
