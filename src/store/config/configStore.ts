import { configureStore } from '@reduxjs/toolkit';
import cardreducer from "../slices/cardSlice"
import streamreducer from "../slices/streamSlice"
import categoriesReducer from "../slices/categoriesSlice"
import ownedCardsReducer from "../slices/ownedCardsSlice"
import ownedStreamsReducer from "../slices/ownedStreamsSlice"
import coinsPurchaseReducer from "../slices/coinsPurchaseSlice"
import cardPurchaseReducer from "../slices/cardPurchaseSlice"
import streamPurchaseReducer from "../slices/streamPurchaseSlice"
import transactionReducer from "../slices/transactionSlice"
import authSlice from "../slices/authSlice"
import administrativSlice from "../slices/administrativSlice"

export const store = configureStore({
    reducer: {
        cardreducer,
        streamreducer,
        categoriesReducer,
        ownedCardsReducer,
        ownedStreamsReducer,
        coinsPurchaseReducer,
        cardPurchaseReducer,
        streamPurchaseReducer,
        transactionsReducer: transactionReducer,
        authInfo: authSlice,
        administrativ: administrativSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch