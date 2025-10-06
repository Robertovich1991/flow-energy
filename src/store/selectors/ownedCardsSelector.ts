import { RootState } from "../config/configStore";

export const ownedCardsListSelector = (state: RootState) => state.ownedCardsReducer.ownedCardsList;
export const ownedCardsLoadingSelector = (state: RootState) => state.ownedCardsReducer.loading;
export const ownedCardsErrorSelector = (state: RootState) => state.ownedCardsReducer.error;
