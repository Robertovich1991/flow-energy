import { configureStore } from '@reduxjs/toolkit';
import cardreducer from "../slices/cardSlice"
import streamreducer from "../slices/streamSlice"

export const store = configureStore({
    reducer: {
        cardreducer,
        streamreducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch