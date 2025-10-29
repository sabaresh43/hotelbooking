import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',

    initialState: {
        isAuthenticated: false,
        username: null,
        sessionKey: null,
        role: 'user',
        token: null,
        token: null,
        employeeId: null  
    },

   reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.username = action.payload.username;
            state.sessionKey = action.payload.sessionKey;
            state.role = action.payload.role;
            state.token = action.payload.token;
            state.employeeId = action.payload.employeeId;  // ✅ Store employeeId
            
            // ✅ Save to localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('sessionKey', action.payload.sessionKey);
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('employeeId', action.payload.employeeId);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = null;
            state.sessionKey = null;
            state.role = 'user';
            state.token = null;
            state.employeeId = null;  // ✅ Clear employeeId
            
            // ✅ Clear localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            localStorage.removeItem('sessionKey');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('employeeId');
        },
        setToken: (state, action) => {
            state.sessionKey = action.payload.sessionKey;
            state.token = action.payload.token;
            
            // ✅ Update localStorage
            localStorage.setItem('sessionKey', action.payload.sessionKey);
            localStorage.setItem('token', action.payload.token);
        },
        // ✅ New reducer to restore session from localStorage
        restoreSession: (state) => {
            const isAuthenticated = localStorage.getItem('isAuthenticated');
            const username = localStorage.getItem('username');
            const sessionKey = localStorage.getItem('sessionKey');
            const role = localStorage.getItem('role');
            const token = localStorage.getItem('token');
            const employeeId = localStorage.getItem('employeeId');
            
            if (isAuthenticated === 'true' && token && employeeId) {
                state.isAuthenticated = true;
                state.username = username;
                state.sessionKey = sessionKey;
                state.role = role || 'user';
                state.token = token;
                state.employeeId = employeeId;
            }
        }
    }
});
export const { login, logout, setToken,restoreSession } = authSlice.actions;

export default authSlice.reducer;