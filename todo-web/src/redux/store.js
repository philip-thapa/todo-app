import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import todoReducer from './todoSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
    authReducer: authReducer,
    todoReducer: todoReducer
})

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);