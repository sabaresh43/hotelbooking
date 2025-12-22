import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    endTime: null,
    isVisible: false,
    hotelId: null,
};

// Helper to get initial state from localStorage if it exists and is valid
const loadState = () => {
    try {
        const stored = localStorage.getItem('bookingTimer');
        if (stored) {
            const { endTime, isVisible, hotelId } = JSON.parse(stored);
            // Check if timer has already expired
            if (endTime && new Date().getTime() > endTime) {
                localStorage.removeItem('bookingTimer');
                return initialState;
            }
            return { endTime, isVisible, hotelId: hotelId || null };
        }
    } catch (e) {
        console.error("Failed to load timer state", e);
    }
    return initialState;
};

const timerSlice = createSlice({
    name: 'timer',
    initialState: loadState(),
    reducers: {
        startTimer: (state, action) => {
            // duration in minutes, default 16
            const durationMinutes = 16;
            const now = new Date().getTime();
            const endTime = now + durationMinutes * 60 * 1000;

            state.endTime = endTime;
            state.isVisible = true;
            state.hotelId = action.payload?.hotelId || null;

            localStorage.setItem('bookingTimer', JSON.stringify(state));
        },
        stopTimer: (state) => {
            state.endTime = null;
            state.isVisible = false;
            state.hotelId = null;
            localStorage.removeItem('bookingTimer');
        },
        syncTimer: (state) => {
            // Can be used to re-sync if needed, but initialState handles load
            const loaded = loadState();
            state.endTime = loaded.endTime;
            state.isVisible = loaded.isVisible;
            state.hotelId = loaded.hotelId;
        }
    }
});

export const { startTimer, stopTimer, syncTimer } = timerSlice.actions;
export default timerSlice.reducer;
