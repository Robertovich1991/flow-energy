import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, Dispatch, PayloadAction, } from '@reduxjs/toolkit'
import mainApi, { setScanMeApiAuthorization } from '../../services/instance/MainInstance';
import { IChangePassord, IRegister, IResendCodeConfirm } from '../../interfaces/types';
import i18n from "../../local/i18next/i18n"
import { IError, setError } from './administrativSlice';
import { clearUserInfo } from './streamSlice';

export interface ILogin {
  email: string,
  password: string,
  returnSecureToken: boolean
}

export interface IAuthState {
  isLogined: boolean
}

const initialState: IAuthState = {
  isLogined: false
}
export const authSlice = createSlice({
  name: 'authInfo',
  initialState,
  reducers: {
    setIsLogined: (state, action: PayloadAction<boolean>) => {
      state.isLogined = action.payload
    },
  },
})
export const login = (data: ILogin, cb: (email: string) => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`user/authenticate`, data);
    if (response.data) {
      setScanMeApiAuthorization(response.data.token)
      AsyncStorage.setItem('accessToken', JSON.stringify(response.data.token));
      AsyncStorage.setItem('userEmail', JSON.stringify(response.data.email));
      dispatch(setIsLogined(true));
      cb && cb(response?.data?.email)
    }
  } catch (err: any) {
    const data: any = {
      title: i18n.t(`Errors.Error_message_title`),
      text: err?.response?.data?.message,
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};

export const passwordReset = (data: any, cb: () => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`user/reset-password`, data);
    if (response?.data) {
      cb()
    }
  } catch (err: any) {
    const data: any = {
      title: i18n.t(`Errors.Error_message_title`),
      text: "No account find with this email",
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};
export const changePassword = (data: IChangePassord, cb: () => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`user/change-password`, data);
    if (response?.data) {
      cb()
    }
  } catch (err: any) {
    const data: any = {
      title: i18n.t(`Errors.Error_message_title`),
      text: "Error while changing password",
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};

export const register = (data: IRegister, cb?: () => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`user/register`, data);
    if (response.status === 200) {
      cb && cb()
    }
  } catch (err: any) {
    const data: IError = {
      title: i18n.t(`Errors.Error_message_title`),
      text: err?.response?.data?.message,
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};
export const codeConfirmation = (verificationCode: string, cb?: () => void) => async (dispatch: Dispatch) => {
  try {
    console.log(verificationCode, 'kkll');

    const response = await mainApi.post('user/verify-phone-number?verificationCode', { verificationCode })
    if (response.status === 204) {
      cb && cb()
    }
  } catch (err: any) {

    const data: IError = {
      title: i18n.t(`Errors.Error_message_title`),
      text: err?.response?.data?.message,
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};
export const resendConfirmationCode = (data: IResendCodeConfirm, cb?: () => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`user/resend-verification-code`, data);
    if (response.status === 200) {
      cb && cb()
    }
  } catch (err: any) {
    const data: IError = {
      title: i18n.t(`Errors.Error_message_title`),
      text: err?.response?.data?.message,
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};
export const signOut = () => async (dispatch: Dispatch) => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('userEmail');
    dispatch(setIsLogined(false));
    dispatch(clearUserInfo());
  } catch (err) {
    console.error('Failed to clear AsyncStorage during sign-out', err);
  }
};

export const { setIsLogined } = authSlice.actions

export default authSlice.reducer