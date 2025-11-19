import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import mainApi from '../../services/instance/MainInstance';
import { logStreamPurchase } from '../../services/appsFlyer';

export interface IStreamPurchaseState {
  loading: boolean;
  error: string | null;
  lastPurchasedStreamId: number | null;
}

const initialState: IStreamPurchaseState = {
  loading: false,
  error: null,
  lastPurchasedStreamId: null,
};

export const streamPurchaseSlice = createSlice({
  name: 'streamPurchase',
  initialState,
  reducers: {
    setStreamPurchaseLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStreamPurchaseError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStreamPurchased: (state, action: PayloadAction<number>) => {
      state.lastPurchasedStreamId = action.payload;
      state.error = null;
    },
    clearStreamPurchase: (state) => {
      state.loading = false;
      state.error = null;
      state.lastPurchasedStreamId = null;
    }
  }
});

export const purchaseStream = (streamId: number, streamTitle: string, streamPrice: number, durationTypeId: number, cb?: () => void) => async (dispatch: Dispatch) => {
  dispatch(setStreamPurchaseLoading(true));
  dispatch(setStreamPurchaseError(null));
  try {
    const response = await mainApi.post(`coins/streams/${streamId}/purchase`, { 
      confirm: true,
      duration_type_id: durationTypeId
    });
    if (response?.data?.success === true) {
      // Log AppsFlyer stream purchase event
      logStreamPurchase(streamId, streamTitle, streamPrice,'[[[[[[[[[[[[[[[[[[[[[[[[[[[');
      dispatch(setStreamPurchased(streamId));
      cb && cb();
    } else {
      dispatch(setStreamPurchaseError(response?.data?.message || 'Purchase failed'));
    }
  } catch (err: any) {
    dispatch(setStreamPurchaseError(err?.response?.data?.message || 'Purchase failed'));
  } finally {
    dispatch(setStreamPurchaseLoading(false));
  }
};

export const { setStreamPurchaseLoading, setStreamPurchaseError, setStreamPurchased, clearStreamPurchase } = streamPurchaseSlice.actions;

export default streamPurchaseSlice.reducer;



