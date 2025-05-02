import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface initialStateTypes {
  isDarkMode: boolean;
}

const initialState: initialStateTypes = {
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsDarkMode } = globalSlice.actions;

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: !!localStorage.getItem('auth_token'),
  user: localStorage.getItem('auth_user'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.username;
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', action.payload.username);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
  },
});

export const { login, logout } = authSlice.actions;

// Export the reducers as named exports
export const globalReducer = globalSlice.reducer;
export const authReducer = authSlice.reducer;
