import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';


export interface ICard {
  cardsList: ICardItem[] | undefined,
 
}

const initialState: ICard = {
  cardsList: [],
 
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCardsList: (state, action: PayloadAction<ICardItem[] | undefined>) => {
      state.cardsList = action.payload
    },
  }
})

export const getCardList = () => async (dispatch: Dispatch) => {
  try {
    
    const response = await mainApi.get('cards');
    if (response.data) {
      console.log(response.data,'.............................');
      
      dispatch(setCardsList(response?.data.data))
    }
  } catch (err: any) {
    console.log(err);
    
  }

};




export const { setCardsList } = cardSlice.actions


export default cardSlice.reducer