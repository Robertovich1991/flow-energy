import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import mainApi from '../../services/instance/MainInstance';
import { getCoinsBalance } from './authSlice';
import { getOwnedCardsList } from './ownedCardsSlice';

export interface ICardPurchaseState {
  loading: boolean;
  error: string | null;
  lastPurchasedCardId: number | null;
}

const initialState: ICardPurchaseState = {
  loading: false,
  error: null,
  lastPurchasedCardId: null,
};

export const cardPurchaseSlice = createSlice({
  name: 'cardPurchase',
  initialState,
  reducers: {
    setCardPurchaseLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCardPurchaseError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCardPurchased: (state, action: PayloadAction<number>) => {
      state.lastPurchasedCardId = action.payload;
      state.error = null;
    },
    clearCardPurchase: (state) => {
      state.loading = false;
      state.error = null;
      state.lastPurchasedCardId = null;
    }
  }
});

export const purchaseCard = (cardId: number, name: string, birthday: string, cb?: () => void) => async (dispatch: Dispatch) => {
  dispatch(setCardPurchaseLoading(true));
  dispatch(setCardPurchaseError(null));
  try {
    const response = await mainApi.post(`coins/cards/${cardId}/purchase`, { 
      name: name,
      birthday: birthday
    });
    if (response?.data?.success === true) {
      dispatch(setCardPurchased(cardId));
      // Refresh balance and owned cards after successful purchase
      dispatch(getCoinsBalance() as any);
      dispatch(getOwnedCardsList() as any);
      cb && cb();
    } else {
      dispatch(setCardPurchaseError(response?.data?.message || 'Purchase failed'));
    }
  } catch (err: any) {
    dispatch(setCardPurchaseError(err?.response?.data?.message || 'Purchase failed'));
  } finally {
    dispatch(setCardPurchaseLoading(false));
  }
};

export const { setCardPurchaseLoading, setCardPurchaseError, setCardPurchased, clearCardPurchase } = cardPurchaseSlice.actions;

export default cardPurchaseSlice.reducer;



