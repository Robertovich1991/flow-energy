import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import mainApi from '../../services/instance/MainInstance';
import { logCoinsPurchase } from '../../services/appsFlyer';

export interface ICoinsPurchaseRequest {
  app_store_product_id: string;
  app_store_transaction_id: string;
  user_id: number;
}

export interface ICoinsPurchaseResponse {
  success: boolean;
  data: {
    coins_added: number;
    new_balance: number;
  };
  message: string;
}

export interface ICoinsPurchaseState {
  loading: boolean;
  error: string | null;
  lastPurchase: {
    coins_added: number;
    new_balance: number;
  } | null;
}

const initialState: ICoinsPurchaseState = {
  loading: false,
  error: null,
  lastPurchase: null,
};

export const coinsPurchaseSlice = createSlice({
  name: 'coinsPurchase',
  initialState,
  reducers: {
    setCoinsPurchaseLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCoinsPurchaseError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCoinsPurchaseSuccess: (state, action: PayloadAction<{coins_added: number, new_balance: number}>) => {
      state.lastPurchase = action.payload;
      state.error = null;
    },
    clearCoinsPurchase: (state) => {
      state.loading = false;
      state.error = null;
      state.lastPurchase = null;
    },
  },
});

export const purchaseCoins = (data: ICoinsPurchaseRequest, coinsAmount?: number, price?: number) => async (dispatch: Dispatch) => {
  dispatch(setCoinsPurchaseLoading(true));
  dispatch(setCoinsPurchaseError(null));

  try {
    const response = await mainApi.post('coins/purchase', data);

    if (response.data && response.data.success === true) {
      // Log AppsFlyer coins purchase event if amount and price are provided
      if (coinsAmount && price) {
        logCoinsPurchase(coinsAmount, price);
      }
      dispatch(setCoinsPurchaseSuccess(response.data.data));
    } else {
      dispatch(setCoinsPurchaseError(response.data?.message || 'Purchase failed'));
    }
  } catch (err: any) {
    console.error('Failed to purchase coins:', err);
    dispatch(setCoinsPurchaseError(err?.response?.data?.message || 'Purchase failed'));
  } finally {
    dispatch(setCoinsPurchaseLoading(false));
  }
};

export const { 
  setCoinsPurchaseLoading, 
  setCoinsPurchaseError, 
  setCoinsPurchaseSuccess, 
  clearCoinsPurchase 
} = coinsPurchaseSlice.actions;

export default coinsPurchaseSlice.reducer;





