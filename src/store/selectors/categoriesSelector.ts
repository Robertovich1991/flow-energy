import { RootState } from "../config/configStore";

export const categoriesListSelector = (state: RootState) => state.categoriesReducer.categoriesList

