import { RootState } from "../config/configStore";

export const transactionsListSelector = (state: RootState) => state.transactionsReducer.transactionsList;
export const transactionsLoadingSelector = (state: RootState) => state.transactionsReducer.loading;
export const transactionsErrorSelector = (state: RootState) => state.transactionsReducer.error;
