import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';

export interface IOwnedStream {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  created_at?: string; // ISO timestamp when access was granted
  duration?: number;   // duration in seconds
  ends_at?: string;    // ISO timestamp when access ends
  category: {
    id: number;
    name: string;
  };
}

export interface IOwnedStreamsResponse {
  success: boolean;
  data: IOwnedStream[];
  message: string;
}

export interface IOwnedStreams {
  ownedStreamsList: IOwnedStream[] | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: IOwnedStreams = {
  ownedStreamsList: [],
  loading: false,
  error: null,
}

export const ownedStreamsSlice = createSlice({
  name: 'ownedStreams',
  initialState,
  reducers: {
    setOwnedStreamsList: (state, action: PayloadAction<IOwnedStream[] | undefined>) => {
      state.ownedStreamsList = action.payload;
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
    clearOwnedStreams: (state) => {
      state.ownedStreamsList = [];
      state.error = null;
      state.loading = false;
    }
  }
})

export const getOwnedStreamsList = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await mainApi.get('streams/user/owned');
    
    if (response.data.success) {
      dispatch(setOwnedStreamsList(response.data.data));
    } else {
      dispatch(setOwnedStreamsList([]));
    }
  } catch (err: any) {
    console.log('Error fetching owned streams:', err);
    dispatch(setError(err.message || 'Failed to fetch owned streams'));
    dispatch(setOwnedStreamsList([]));
  }
};

export const { setOwnedStreamsList, setLoading, setError, clearOwnedStreams } = ownedStreamsSlice.actions

export default ownedStreamsSlice.reducer
