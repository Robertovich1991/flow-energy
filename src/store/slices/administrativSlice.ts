import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAdministrativ {
    error: IError | undefined,
}
export interface IError {
    title: string;
    text: string;
    buttonTitle: string;
}

const initialState: IAdministrativ = {
    error: undefined,
}

export const administrativeSlice = createSlice({
    name: 'administrative',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<IError | undefined>) => {
            state.error = action.payload
        },

    },
})

export const { setError } = administrativeSlice.actions

export default administrativeSlice.reducer