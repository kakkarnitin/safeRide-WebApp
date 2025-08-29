import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import verificationReducer from './slices/verificationSlice';
import ridesReducer from './slices/ridesSlice';
import creditsReducer from './slices/creditsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    verification: verificationReducer,
    rides: ridesReducer,
    credits: creditsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;