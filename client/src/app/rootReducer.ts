import { combineReducers } from '@reduxjs/toolkit';
import invoiceDraftReducer from '../features/invoiceDraft/invoiceDraftSlice';

export const rootReducer = combineReducers({
  invoiceDraft: invoiceDraftReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
