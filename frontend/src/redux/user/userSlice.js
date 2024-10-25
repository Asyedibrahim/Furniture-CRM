import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: null,
    error: null,
    timeStamp: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
            state.timeStamp = Date.now();
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
            state.timeStamp = null;
        },
        checkExpiration: (state) => {
            const now = Date.now();
            const oneDay = 43200000; //12h
            if (state.timeStamp && now - state.timeStamp > oneDay) {
                state.currentUser = null;
                state.error = 'Session expired';
                state.timeStamp = null;
            }
        }
    }
});

export const { signInStart, signInSuccess, signInFailure, signOutSuccess, checkExpiration } = userSlice.actions;

export default userSlice.reducer;