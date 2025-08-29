import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RideOffer } from '../../types/rides';

interface RidesState {
  availableRides: RideOffer[];
  loading: boolean;
  error: string | null;
}

const initialState: RidesState = {
  availableRides: [],
  loading: false,
  error: null,
};

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    fetchRidesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRidesSuccess(state, action: PayloadAction<RideOffer[]>) {
      state.loading = false;
      state.availableRides = action.payload;
    },
    fetchRidesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    offerRide(state, action: PayloadAction<RideOffer>) {
      state.availableRides.push(action.payload);
    },
    removeRide(state, action: PayloadAction<string>) {
      state.availableRides = state.availableRides.filter(ride => ride.id !== action.payload);
    },
  },
});

export const {
  fetchRidesStart,
  fetchRidesSuccess,
  fetchRidesFailure,
  offerRide,
  removeRide,
} = ridesSlice.actions;

export default ridesSlice.reducer;