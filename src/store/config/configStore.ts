import { configureStore } from '@reduxjs/toolkit';
import cardreducer from "../slices/cardSlice"
import streamreducer from "../slices/streamSlice"
import authSlice from "../slices/authSlice"
import administrativSlice from "../slices/administrativSlice"

export const store = configureStore({
    reducer: {
        cardreducer,
        streamreducer,
        authInfo: authSlice,
        administrativ: administrativSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch