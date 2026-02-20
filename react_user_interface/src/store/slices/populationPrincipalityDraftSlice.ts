import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/Api';
import { logoutSuccess } from './userSlice';
import { type Principality } from '../../modules/types';

const api = new Api({ withCredentials: true })

interface PrincipalityWithArea extends Principality {
  area?: number | null;
}

interface PopulationPrincipalityState {
  app_id: number | null;
  count: number;
  researcherName: string | null;
  items: PrincipalityWithArea[];
}

const initialState: PopulationPrincipalityState = {
  app_id: null,
  count: 0,
  researcherName: null,
  items: [],
};

export const getDraftPopulation = createAsyncThunk(
  'populationDraft/getDraft',
  async (_, { rejectWithValue }) => {
    try {
      const draftInfo = await api.api.populationsDraftList();
      const id = draftInfo.data.id;

      if (!id) return rejectWithValue("Черновик не найден");

      const fullDraft = await api.api.populationsDetail(id);
      
      return fullDraft.data; 
    } catch (e: any) {
      return rejectWithValue("Ошибка загрузки черновика");
    }
  }
);

export const addToDraft = createAsyncThunk(
  'populationDraft/add',
  async (principalityId: number, { dispatch, rejectWithValue }) => {
    try {
      await api.api.principalitiesAddToDraftPopulationCreate(principalityId);
      dispatch(getDraftPopulation()); 
      return;
    } catch (e: any) {
      return rejectWithValue("Не удалось добавить в черновик");
    }
  }
);

export const deletePrincipalityFromDraft = createAsyncThunk(
  'populationDraft/delete',
  async ({ populationId, principalityId }: { populationId: number; principalityId: number }, { dispatch, rejectWithValue }) => {
    try {
      await api.api.populationPrincipalitiesDeletePrincipalityDelete(populationId, principalityId);
      
      dispatch(getDraftPopulation()); 
      return;
    } catch (e: any) {
      return rejectWithValue("Не удалось удалить княжество из черновика");
    }
  }
);

export const updatePopulationResearcher = createAsyncThunk(
  'populationDraft/updateResearcher',
  async ({ populationId, researcherName }: { populationId: number; researcherName: string }, { rejectWithValue }) => {
    try {
      await api.api.populationsEditUpdate(populationId, { researcher_name: researcherName });
      return researcherName;
    } catch (e: any) {
      return rejectWithValue("Не удалось сохранить исследователя");
    }
  }
);

export const updatePrincipalityArea = createAsyncThunk(
  'populationDraft/updateArea',
  async ({ populationId, principalityId, area }: { populationId: number; principalityId: number; area: number }, { rejectWithValue }) => {
    try {
      await api.api.populationPrincipalitiesEditUpdate(populationId, principalityId, { area });
      return { principalityId, area };
    } catch (e: any) {
      return rejectWithValue("Не удалось сохранить площадь");
    }
  }
);

export const deletePopulation = createAsyncThunk(
  'populationDraft/deleteFull',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.api.populationsDeleteDelete(id);
      dispatch(resetDraft()); 
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Не удалось удалить заявку");
    }
  }
);

export const formPopulation = createAsyncThunk(
  'population/form',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.api.populationsFormUpdate(id); 
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || "Ошибка при формировании заявки");
    }
  }
);

const populationPrincipalityDraftSlice = createSlice({
  name: 'populationDraft',
  initialState,
  reducers: {
    resetDraft: (state) => {
      state.app_id = null;
      state.count = 0;
      state.researcherName = null;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDraftPopulation.fulfilled, (state, action) => {
        state.app_id = action.payload.population.id;
        state.researcherName = action.payload.population.researcher_name; 
        state.count = action.payload.principalities.length;
        state.items = action.payload.principalities; 
      })
      .addCase(formPopulation.fulfilled, (state) => {
        state.app_id = null;
        state.count = 0;
        state.researcherName = null;
        state.items = [];
      })
      .addCase(updatePopulationResearcher.fulfilled, (state, action) => {
        state.researcherName = action.payload;
      })
      .addCase(deletePopulation.fulfilled, (state) => {
        state.app_id = null;
        state.count = 0;
        state.items = [];
        state.researcherName = null;
      })
      .addCase(logoutSuccess, (state) => {
        state.app_id = null;
        state.count = 0;
        state.researcherName = null;
        state.items = [];
      });
  },
});

export const { resetDraft } = populationPrincipalityDraftSlice.actions;
export default populationPrincipalityDraftSlice.reducer;