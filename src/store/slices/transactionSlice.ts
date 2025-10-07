import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';

export interface ITransaction {
  id: number;
  type: 'purchase' | 'refund' | 'reward';
  amount: number;
  description: string;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface ITransactionsResponse {
  success: boolean;
  data: ITransaction[];
  message: string;
}

export interface ITransactions {
  transactionsList: ITransaction[] | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: ITransactions = {
  transactionsList: [],
  loading: false,
  error: null,
}

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactionsList: (state, action: PayloadAction<ITransaction[] | undefined>) => {
      state.transactionsList = action.payload;
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
    clearTransactions: (state) => {
      state.transactionsList = [];
      state.error = null;
      state.loading = false;
    }
  }
})

export const getTransactionsList = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await mainApi.get('coins/transactions');
    console.log(response.data,'--------------------------------------------------------------jjj');
    
    if (response.data.success) {
      dispatch(setTransactionsList(response.data.data));
    } else {
      dispatch(setTransactionsList([]));
    }
  } catch (err: any) {
    console.log('Error fetching transactions:', err);
    dispatch(setError(err.message || 'Failed to fetch transactions'));
    dispatch(setTransactionsList([]));
  }
};

export const { setTransactionsList, setLoading, setError, clearTransactions } = transactionSlice.actions

export default transactionSlice.reducer
