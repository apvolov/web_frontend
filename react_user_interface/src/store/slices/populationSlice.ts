import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/Api';

const api = new Api();

export interface PopulationListItem {
    id: number;
    create_date: string;
    form_date: string | null;
    status: 'draft' | 'formed' | 'rejected' | 'finished' | 'deleted';
    user_login: string;
    admin_login: string;
    calculated_count: number;
    researcher_name: string | null;
}

export interface PopulationDetail extends PopulationListItem {
    items: {
        id: number;
        name: string;
        area: number;
        image: string | null;
        year0: number;
        year1: number;
    }[];
}

interface PopulationsState {
    list: PopulationListItem[];
    currentItem: PopulationDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: PopulationsState = {
    list: [],
    currentItem: null,
    loading: false,
    error: null,
};

export const getPopulations = createAsyncThunk<
    PopulationListItem[], 
    void, 
    { rejectValue: string }
>(
    'populations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.api.populationsList();
            return response.data as PopulationListItem[];
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.error || "Ошибка загрузки списка заявок");
        }
    }
);

export const getPopulation = createAsyncThunk<
    PopulationDetail,
    number,
    { rejectValue: string }
>(
    'populations/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.api.populationsDetail(id); 
            return response.data as PopulationDetail;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.error || `Ошибка загрузки заявки №${id}`);
        }
    }
);

const populationsSlice = createSlice({
    name: 'populations',
    initialState,
    reducers: {
        clearCurrentItem: (state) => {
            state.currentItem = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPopulations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPopulations.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getPopulations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            .addCase(getPopulation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentItem = null;
            })
            .addCase(getPopulation.fulfilled, (state, action: any) => {
                state.loading = false;
                state.currentItem = {
                    ...action.payload.population,
                    items: action.payload.principalities
                };
            })
            .addCase(getPopulation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentItem } = populationsSlice.actions;
export default populationsSlice.reducer;