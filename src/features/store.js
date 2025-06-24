import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        // auth: persistedAuthReducer
        auth: authReducer
    },
    devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});

//export const persistor = persistStore(store);
