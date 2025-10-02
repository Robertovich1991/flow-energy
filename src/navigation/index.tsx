
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '..//theme';
import Home from '../screens/Home';
import Cards from '../screens/Cards';
import CardDetail from '../screens/CardDetail';
import NameChargeModal from '../screens/NameChargeModal';
import Streams from '../screens/Streams';
import StreamSession from '../screens/StreamSession';
import StreamAccessModal from '../screens/StreamAccessModal';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import CoinsPurchaseModal from '../screens/CoinsPurchaseModal';
import { HomeIcon, CardsIcon, StreamsIcon, ProfileIcon } from '../components/TabBarIcons';
import CoinsHeader from '../components/CoinsHeader';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsRoot() {
  const mockCoinCount = 0; // Mock coin count

  return (
    <Tabs.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.bg },
        headerTintColor: theme.colors.text,
        headerTitle: '',
        headerRight: () => <CoinsHeader coinCount={mockCoinCount} />,
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
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown:false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown:false }} />
        <Stack.Screen name="Tabs" component={TabsRoot} options={{ headerShown:false }} />
        <Stack.Screen name="CardDetail" component={CardDetail} options={{ title: 'Card' }} />
        <Stack.Screen name="StreamSession" component={StreamSession} options={{ title: 'Session' }} />
        <Stack.Screen name="NameChargeModal" component={NameChargeModal} options={{ presentation: 'modal', title:'Charge' }} />
        <Stack.Screen name="StreamAccessModal" component={StreamAccessModal} options={{ presentation: 'modal', title:'Access' }} />
        <Stack.Screen name="CoinsPurchaseModal" component={CoinsPurchaseModal} options={{ presentation: 'modal', title:'Buy Coins' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
