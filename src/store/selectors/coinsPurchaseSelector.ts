import { RootState } from "../config/configStore";

export const coinsPurchaseLoadingSelector = (state: RootState) => state.coinsPurchaseReducer.loading;
export const coinsPurchaseErrorSelector = (state: RootState) => state.coinsPurchaseReducer.error;
export const coinsPurchaseLastPurchaseSelector = (state: RootState) => state.coinsPurchaseReducer.lastPurchase;
