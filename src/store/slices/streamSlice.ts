import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';


export interface IStream {
  streamList: IStreamItem[] | undefined,

}

const initialState: IStream = {
  streamList: [],

}

export const streamlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    setstreamList: (state, action: PayloadAction<IStreamItem[] | undefined>) => {
      state.streamList = action.payload
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




export const { setstreamList } = streamlice.actions


export default streamlice.reducer