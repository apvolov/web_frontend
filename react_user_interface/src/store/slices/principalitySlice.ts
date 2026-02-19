import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, type DsPrincipality } from '../../api/Api';
import { MOCK_PRINCIPALITIES } from '../../mocks/principalities';

const api = new Api();

interface PrincipalityState {
  items: DsPrincipality[];
  currentPrincipality: DsPrincipality | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PrincipalityState = {
  items: [],
  currentPrincipality: null,
  isLoading: false,
  error: null,
};

export const getPrincipalities = createAsyncThunk<
  DsPrincipality[], 
  { name?: string } | undefined, 
  { rejectValue: string }
>(
  'principalities/getPrincipalities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.api.principalitiesList(params);
      return response.data;
    } catch (e: any) {
      console.warn("Бэкенд недоступен (список), используем моки");
      const query = params?.name?.toLowerCase() || "";
      const filtered = MOCK_PRINCIPALITIES.filter(p => 
        p.name.toLowerCase().includes(query)
      ) as DsPrincipality[];

      if (filtered.length === 0 && query) {
        return rejectWithValue("Ничего не найдено");
      }

      return filtered;
    }
  }
);

export const getPrincipality = createAsyncThunk<
  DsPrincipality,
  number,
  { rejectValue: string }
>(
  'principalities/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.api.principalitiesDetail(id);
      return response.data;
    } catch (e: any) {
      console.warn("Бэкенд недоступен (детали), ищем в моках");
      const foundMock = MOCK_PRINCIPALITIES.find(p => p.id === id);
      if (foundMock) return foundMock as DsPrincipality;
      return rejectWithValue("Княжество не найдено");
    }
  }
);

const principalitySlice = createSlice({
  name: 'principalities',
  initialState,
  reducers: {
    clearCurrentPrincipality: (state) => {
      state.currentPrincipality = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrincipalities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPrincipalities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getPrincipalities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при загрузке списка";
      })

      .addCase(getPrincipality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPrincipality.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrincipality = action.payload;
      })
      .addCase(getPrincipality.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Княжество не найдено";
      });
  },
});

export const { clearCurrentPrincipality } = principalitySlice.actions;
export default principalitySlice.reducer;