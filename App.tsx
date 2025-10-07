
import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import RootNavigator from './src/navigation';
import { Provider, useDispatch } from "react-redux";
import { store } from './src/store/config/configStore';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setScanMeApiAuthorization } from './src/services/instance/MainInstance';
import { getCoinsBalance } from './src/store/slices/authSlice';

const Bootstrap = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const token = storedToken ? JSON.parse(storedToken) : null;
        setScanMeApiAuthorization(token);
        dispatch(getCoinsBalance() as any);
      } catch (e) {
        // noop
      }
    };
    init();
  }, [dispatch]);
  return null;
};


export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Bootstrap />
          <StatusBar />
          <RootNavigator />
        </Provider>
      </I18nextProvider>
    </View>
  );
}
