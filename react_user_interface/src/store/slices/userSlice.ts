import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, type SerializerUserJSON } from '../../api/Api';

const api = new Api({
  withCredentials: true, // Попробуй вынести это на уровень выше
});

interface UserState {
  login: string | null;
  isAuth: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

// const initialState: UserState = {
//   login: localStorage.getItem('userLogin') || null,
//   isAuth: !!localStorage.getItem('userLogin'),
//   isAdmin: localStorage.getItem('userRole') === 'admin',
//   isLoading: false,
//   error: null,
// };

const initialState: UserState = {
  login: null,
  isAuth: false, // Теперь при F5 ты всегда будешь "гостем"
  isAdmin: false,
  isLoading: false,
  error: null,
};

const saveUserToStorage = (login: string, role?: string) => {
    localStorage.setItem('userLogin', login);
    if (role === 'admin') {
        localStorage.setItem('userRole', 'admin');
    } else {
        localStorage.removeItem('userRole');
    }
};

export const loginUser = createAsyncThunk<
  SerializerUserJSON,
  SerializerUserJSON,
  { rejectValue: string }
>(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.api.usersLoginCreate(userData);
      const user = response.data.user;
      if (user?.login) {
        saveUserToStorage(user.login, (user as any).role);
      }
      return user as SerializerUserJSON;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Неверный логин или пароль");
    }
  }
);

export const registerUser = createAsyncThunk<
  SerializerUserJSON,
  SerializerUserJSON,
  { rejectValue: string }
>(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.api.usersRegisterCreate(userData);
      if (response.data?.login) {
        saveUserToStorage(response.data.login, (response.data as any).role);
      }
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Ошибка при регистрации");
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.api.usersLogoutCreate();
      return null;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Ошибка сессии");
    } finally {
      localStorage.removeItem('userLogin');
      localStorage.removeItem('userRole');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.api.usersMeList();
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Не удалось загрузить профиль");
    }
  }
);

export const updateCurrentUser = createAsyncThunk(
  'user/updateMe',
  async (updateData: { login?: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await api.api.usersMeUpdate(updateData);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Не удалось обновить данные");
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("ДАННЫЕ ОТ СЕРВЕРА:", action.payload);
        state.isLoading = false;
        state.isAuth = true;
        const data = action.payload as any; 
        state.login = data.login || null;
        state.isAdmin = data.is_admin === true; 
        if (data.login) {
            localStorage.setItem('userLogin', data.login);
        }
        if (state.isAdmin) {
            localStorage.setItem('userRole', 'admin');
        } else {
            localStorage.removeItem('userRole');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.login = null;
        state.isAuth = false;
        state.isAdmin = false;
      })
      .addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.login = action.payload.login || null;
        state.isAdmin = (action.payload as any).role === 'admin'; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; 
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const data = action.payload as any;
        
        state.login = data.login ?? null;
        state.isAuth = !!data.login;
        state.isAdmin = data.is_admin === true; // Прямое обращение
        
        if (state.isAdmin) {
            localStorage.setItem('userRole', 'admin');
        } else {
            localStorage.removeItem('userRole');
        }
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.login = action.payload.login ?? null;
        state.error = null;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;