import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',

    initialState: {
        isAuthenticated: false,
        username: null,
        sessionKey: null,
        role: 'user',
        token: null
    },

    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.username = action.payload.username;
            state.sessionKey = action.payload.sessionKey;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isAuthenticated = false;
            state.username = null;
            state.sessionKey = null;
            state.role = 'user';
            state.token = null;
        },
        setToken: (state, action) => {
            state.sessionKey = action.payload.sessionKey
            state.token = action.payload.token;
        },
    }
});

export const { login, logout, setToken } = authSlice.actions;

export default authSlice.reducer;