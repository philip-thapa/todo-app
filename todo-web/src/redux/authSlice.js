import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    userDetails: {},
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userDetails = JSON.stringify(action.payload);
        },

        logout: (state, action) => {
            state.isLoggedIn = false;
            state.userDetails = null;
        }
    }
})

export const {login, logout} = authSlice.actions

export default authSlice.reducer
