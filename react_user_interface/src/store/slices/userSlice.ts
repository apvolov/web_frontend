import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  login: string | null;
  isAuth: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  login: null,
  isAuth: false,
  isAdmin: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<{ login: string; is_admin: boolean }>) => {
      state.isLoading = false;
      state.isAuth = true;
      state.login = action.payload.login;
      state.isAdmin = action.payload.is_admin;
      state.error = null;
    },
    authError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.login = null;
      state.isAuth = false;
      state.isAdmin = false;
      state.isLoading = false;
      state.error = null;
    },
    clearUserError: (state) => {
      state.error = null;
    }
  }
});

export const { 
    authStart, 
    setUser, 
    authError, 
    logoutSuccess, 
    clearUserError 
} = userSlice.actions;

export default userSlice.reducer;