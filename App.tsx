
import { StatusBar, View } from 'react-native';
import RootNavigator from './src/navigation';
import { Provider } from "react-redux";
import { store } from './src/store/config/configStore';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/index';


export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <StatusBar />
          <RootNavigator />
        </Provider>
      </I18nextProvider>
    </View>
  );
}
