import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditsState {
    points: number;
}

const initialState: CreditsState = {
    points: 5, // Each parent starts with 5 credit points
};

const creditsSlice = createSlice({
    name: 'credits',
    initialState,
    reducers: {
        earnCredit: (state) => {
            state.points += 1; // Earn 1 credit point when a ride is availed
        },
        useCredit: (state) => {
            if (state.points > 0) {
                state.points -= 1; // Use 1 credit point when a ride is used
            }
        },
        setCredits: (state, action: PayloadAction<number>) => {
            state.points = action.payload; // Set credits to a specific value
        },
    },
});

export const { earnCredit, useCredit, setCredits } = creditsSlice.actions;

export default creditsSlice.reducer;