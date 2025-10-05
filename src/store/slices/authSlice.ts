import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, Dispatch, PayloadAction, } from '@reduxjs/toolkit'
import mainApi, { setScanMeApiAuthorization } from '../../services/instance/MainInstance';
import { IError, setError } from './administrativSlice';

export interface ILogin {
  email: string,
  password: string,
}

export interface IChangePassord {
  oldPassword: string,
  newPassword: string
}

export interface IRegister {
  name: string
  email: string,
  password: string,
  password_confirmation: string
}

export interface IResendCodeConfirm {
  email: string
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
export const login = (data: ILogin, cb: (email: string) => void, errorCb?: (error: string) => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`auth/login`, data);

    if (response.data && response.data.success === true) {
console.log(response.data,'response.data',response.data.data.token,'ppppppppppppppppppppppppppppppppppppppppppppppppppp');

      setScanMeApiAuthorization(response.data.token)
      AsyncStorage.setItem('accessToken', JSON.stringify(response.data.data.token));
      AsyncStorage.setItem('userEmail', JSON.stringify(response.data.data.user));
      dispatch(setIsLogined(true));
      cb && cb(response?.data?.user)
    }
  } catch (err: any) {
    console.log(err, '999999999999999999999');

    // Handle 401 specifically
    if (err?.response?.status === 401) {
      errorCb && errorCb('You are not authorized');
    } else {
      // For other errors, use global error handling
      const data: IError = {
        title: 'Error',
        text: err?.response?.data?.message || 'Login failed',
        buttonTitle: 'OK'
      }
      dispatch(setError(data))
    }
  }
};

export const passwordReset = (data: any, cb: () => void) => async (dispatch: Dispatch) => {
  try {
    const response = await mainApi.post(`user/reset-password`, data);
    if (response?.data) {
      cb()
    }
  } catch (err: any) {
    const data: IError = {
      title: 'Error',
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
    const data: IError = {
      title: 'Error',
      text: "Error while changing password",
      buttonTitle: 'OK'
    }
    dispatch(setError(data))
  }
};

export const register = (data: IRegister, cb?: () => void) => async () => {
  try {
    console.log(data,'------------------------');
    
    const response = await mainApi.post(`auth/register`, data);
    if (response.status === 201) {
      cb && cb()
    }
   // if (response.status === 200) {
      console.log(response,'response...............................................');
      
  //    cb && cb()
  //  }
  } catch (err: any) {
  console.log(err,'oooooooooooooooooooooooooooooooooooooooo');
  
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
      title: 'Error',
      text: err?.response?.data?.message || 'Verification failed',
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
      title: 'Error',
      text: err?.response?.data?.message || 'Failed to resend code',
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
    //   dispatch(clearUserInfo());
  } catch (err) {
    console.error('Failed to clear AsyncStorage during sign-out', err);
  }
};

export const { setIsLogined } = authSlice.actions

export default authSlice.reducer