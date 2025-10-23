
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '..//theme';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getCoinsBalance } from '../store/slices/authSlice';
import { setScanMeApiAuthorization } from '../services/instance/MainInstance';
import Home from '../screens/Home';
import Cards from '../screens/Cards';
import CardDetail from '../screens/CardDetail';
import NameChargeModal from '../screens/NameChargeModal';
import Streams from '../screens/Streams';
import StreamDetail from '../screens/StreamDetail';
import StreamSession from '../screens/StreamSession';
import StreamAccessModal from '../screens/StreamAccessModal';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import CoinsPurchaseModal from '../screens/CoinsPurchaseModal';
import MyCards from '../screens/MyCards';
import MyStreams from '../screens/MyStreams';
import ImageGallery from '../screens/ImageGallery';
import CategoryCards from '../screens/CategoryCards';
import CategoryStreams from '../screens/CategoryStreams';
import { HomeIcon, CardsIcon, StreamsIcon, ProfileIcon } from '../components/TabBarIcons';
import CoinsHeader from '../components/CoinsHeader';
import BackgroundWrapper from '../components/BackgroundWrapper';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsRoot() {
  return (
    <BackgroundWrapper>
      <Tabs.Navigator 
        screenOptions={{ 
          headerShown: true,
          headerStyle: { 
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTransparent: true,
          headerTintColor: theme.colors.text,
          headerTitle: '',
          headerRight: () => <CoinsHeader />,
          tabBarStyle: { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }
        }}
      >
      <Tabs.Screen 
        name="HomeTab" 
        component={Home} 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ focused }: { focused: boolean }) => <HomeIcon focused={focused} />
        }} 
      />
      <Tabs.Screen 
        name="CardsTab" 
        component={Cards} 
        options={{ 
          title: 'Cards',
          tabBarIcon: ({ focused }: { focused: boolean }) => <CardsIcon focused={focused} />
        }} 
      />
      <Tabs.Screen 
        name="StreamsTab" 
        component={Streams} 
        options={{ 
          title: 'Streams',
          tabBarIcon: ({ focused }: { focused: boolean }) => <StreamsIcon focused={focused} />
        }} 
      />
      <Tabs.Screen 
        name="ProfileTab" 
        component={Profile} 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ focused }: { focused: boolean }) => <ProfileIcon focused={focused} />
        }} 
      />
      </Tabs.Navigator>
    </BackgroundWrapper>
  );
}

export default function RootNavigator() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [bootstrapping, setBootstrapping] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokenString = await AsyncStorage.getItem('accessToken');
        const token = tokenString ? JSON.parse(tokenString) : null;
        const isLoggedIn = !!token;
        setIsLoggedIn(isLoggedIn);
        
        // Set the token in API headers if user is logged in
        if (isLoggedIn && token) {
          setScanMeApiAuthorization(token);
          // Fetch coins balance after setting the token
          dispatch(getCoinsBalance() as any);
        }
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setBootstrapping(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (bootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.bg }}>
        <ActivityIndicator size="large" color={theme.colors.text} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Tabs' : 'Login'}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown:false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown:false }} />
        <Stack.Screen name="Tabs" component={TabsRoot} options={{ headerShown:false }} />
        <Stack.Screen name="CardDetail" component={CardDetail} options={{ title: 'Card' }} />
        <Stack.Screen name="StreamDetail" component={StreamDetail} options={{ title: 'Stream' }} />
        <Stack.Screen name="MyCards" component={MyCards} options={{ title: t('profile.myCards') }} />
        <Stack.Screen name="MyStreams" component={MyStreams} options={{ title: t('common.myStreams') }} />
        <Stack.Screen name="CategoryCards" component={CategoryCards} options={{ title: 'Card Categories' }} />
        <Stack.Screen name="CategoryStreams" component={CategoryStreams} options={{ title: 'Stream Categories' }} />
        <Stack.Screen 
          name="ImageGallery" 
          component={ImageGallery} 
          options={{ headerShown: false, presentation: 'modal' }} 
        />
        <Stack.Screen name="StreamSession" component={StreamSession} options={{ title: 'Session' }} />
        <Stack.Screen name="NameChargeModal" component={NameChargeModal} options={{ presentation: 'modal', title:'Charge' }} />
        <Stack.Screen name="StreamAccessModal" component={StreamAccessModal} options={{ presentation: 'modal', title:'Access' }} />
        <Stack.Screen name="CoinsPurchaseModal" component={CoinsPurchaseModal} options={{ presentation: 'modal', title:'Buy Coins' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
