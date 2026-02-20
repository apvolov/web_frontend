import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DsPrincipality } from '../../api/Api'; 

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

const principalitySlice = createSlice({
  name: 'principalities',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setPrincipalities: (state, action: PayloadAction<DsPrincipality[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    setCurrentPrincipality: (state, action: PayloadAction<DsPrincipality>) => {
      state.isLoading = false;
      state.currentPrincipality = action.payload;
    },
    fetchError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCurrentPrincipality: (state) => {
      state.currentPrincipality = null;
    }
  }
});

export const { 
  fetchStart, 
  setPrincipalities, 
  setCurrentPrincipality, 
  fetchError, 
  clearCurrentPrincipality 
} = principalitySlice.actions;

export default principalitySlice.reducer;