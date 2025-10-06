import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';
import { Stream, Category } from '../types';

export interface IStream {
  streamList: Stream[] | undefined,
  categories: Category[] | undefined,
}

const initialState: IStream = {
  streamList: [],
  categories: [],
}

export const streamlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    setstreamList: (state, action: PayloadAction<Stream[] | undefined>) => {
      state.streamList = action.payload
    },
    setCategories: (state, action: PayloadAction<Category[] | undefined>) => {
      state.categories = action.payload
    },
  }
})

export const getStreamList = () => async (dispatch: Dispatch) => {
  try {

    const response = await mainApi.get('streams');
    if (response.data) {
      console.log(response.data, '.............................');

      dispatch(setstreamList(response?.data.data))
    }
  } catch (err: any) {
    console.log(err);

  }

};




export const { setstreamList, setCategories } = streamlice.actions


export default streamlice.reducer