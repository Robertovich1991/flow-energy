import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';

export interface IOwnedCard {
  id: number;
  user_id: number;
  card_id: number;
  name: string;
  birthday: string; // Format: "2022-10-15T00:00:00.000000Z"
  coins_spent: number;
  created_at: string;
  updated_at: string;
  card: {
    id: number;
    tenant_id: number;
    categoryId: number;
    code: string;
    title: string;
    image: string;
    description: string;
    intensityPct: number;
    price: number;
    created_at: string;
    category: {
      id: number;
      name: string;
    };
  };
  transaction: {
    id: number;
    user_id: number;
    type: string;
    amount: number;
    balance_after: number;
    reference_type: string;
    reference_id: number;
    app_store_transaction_id: string | null;
    description: string;
    metadata: any;
  };
  transaction_id: number;
}

export interface IOwnedCardsResponse {
  success: boolean;
  data: IOwnedCard[];
  message: string;
}

export interface IOwnedCards {
  ownedCardsList: IOwnedCard[] | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: IOwnedCards = {
  ownedCardsList: [],
  loading: false,
  error: null,
}

export const ownedCardsSlice = createSlice({
  name: 'ownedCards',
  initialState,
  reducers: {
    setOwnedCardsList: (state, action: PayloadAction<IOwnedCard[] | undefined>) => {
      state.ownedCardsList = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOwnedCards: (state) => {
      state.ownedCardsList = [];
      state.error = null;
      state.loading = false;
    }
  }
})

export const getOwnedCardsList = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await mainApi.get('cards/user/owned');
    
    if (response.data.success) {
      dispatch(setOwnedCardsList(response.data.data));
    } else {
      dispatch(setOwnedCardsList([]));
    }
  } catch (err: any) {
    console.log('Error fetching owned cards:', err);
    dispatch(setError(err.message || 'Failed to fetch owned cards'));
    dispatch(setOwnedCardsList([]));
  }
};

export const { setOwnedCardsList, setLoading, setError, clearOwnedCards } = ownedCardsSlice.actions

export default ownedCardsSlice.reducer
