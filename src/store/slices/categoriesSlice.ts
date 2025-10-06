import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import mainApi from '../../services/instance/MainInstance';
import { Category } from '../types';

export interface ICategory {
  categoriesList: Category[] | undefined,
}

const initialState: ICategory = {
  categoriesList: [],
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoriesList: (state, action: PayloadAction<Category[] | undefined>) => {
      state.categoriesList = action.payload
    },
  }
})

export const getCategoriesList = () => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.get('categories');
    if (response.data) {
      console.log(response.data, '.............................');
      dispatch(setCategoriesList(response?.data.data))
    }
  } catch (err: any) {
    console.log(err);
  }
};

export const { setCategoriesList } = categoriesSlice.actions

export default categoriesSlice.reducer
