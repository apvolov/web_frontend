import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import principalityReducer from './slices/principalitySlice';
import userReducer from './slices/userSlice';
import populationDraftReducer from './slices/populationPrincipalityDraftSlice';
import populationsReducer from './slices/populationSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    principalities: principalityReducer,
    user: userReducer,
    populationDraft: populationDraftReducer,
    populations: populationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;