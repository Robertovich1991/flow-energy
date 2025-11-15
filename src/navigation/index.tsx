
import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '..//theme';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

// Create a context to share tab navigation
export const TabNavigationContext = createContext<any>(null);

export const useTabNavigation = () => {
  const navigation = useContext(TabNavigationContext);
  if (!navigation) {
    throw new Error('useTabNavigation must be used within TabNavigationProvider');
  }
  return navigation;
};

const CardsStack = createNativeStackNavigator();
function CardsStackScreen() {
  return (
    <CardsStack.Navigator screenOptions={{ headerShown: false }}>
      <CardsStack.Screen name="CardsMain" component={Cards} />
      <CardsStack.Screen name="CardDetail" component={CardDetail} options={{ headerShown: false }} />
    </CardsStack.Navigator>
  );
}

function TabsRoot() {
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top || (Platform.OS === 'ios' ? 44 : 24);
  // CoinsHeader content height: ~44px (content) + 12px (paddingBottom) = ~56px
  const headerHeight = statusBarHeight + 30; // status bar + CoinsHeader content height
  const [tabNavigation, setTabNavigation] = useState<any>(null);
  
  // Helper to capture navigation from any tab screen
  const createTabScreenWrapper = (Component: React.ComponentType<any>) => {
    return (props: any) => {
      const nav = useNavigation();
      React.useEffect(() => {
        setTabNavigation(nav);
      }, [nav]);
      return <Component {...props} />;
    };
  };
  
  return (
    <TabNavigationContext.Provider value={tabNavigation}>
      <BackgroundWrapper topPadding={headerHeight}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <CoinsHeader />
        </View>
        <Tabs.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 90,
              backgroundColor: '#161427',
              borderTopColor: theme.colors.border,
              paddingTop: 10,
              paddingBottom: 18, // give space so items sit visually centered
              alignItems: 'center',
              justifyContent: 'center',
            },
            tabBarItemStyle: {
              alignItems: 'center',
              justifyContent: 'center',
            },
            tabBarIconStyle: {
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
        <Tabs.Screen
          name="HomeTab"
          component={createTabScreenWrapper(Home)}
          options={{
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: focused ? 'white' : '#9AA0A6',
                  textAlign: 'center',
                }}
              >
                Home
              </Text>
            ),
            tabBarIcon: ({ focused }: { focused: boolean }) => <HomeIcon focused={focused} />
          }}
        />

        <Tabs.Screen
          name="StreamsTab"
          component={createTabScreenWrapper(Streams)}
          options={{
            title: 'Flow',
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: focused ? 'white' : '#9AA0A6',
                  textAlign: 'center',
                }}
              >
                Flow
              </Text>
            ),
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <StreamsIcon focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="CardsTab"
          component={createTabScreenWrapper(CardsStackScreen)}
          options={{
            title: 'Cards',
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: focused ? 'white' : '#9AA0A6',
                  textAlign: 'center',
                }}
              >
                Cards
              </Text>
            ),
            tabBarIcon: ({ focused }: { focused: boolean }) => <CardsIcon focused={focused} />
          }}
        />
        <Tabs.Screen
          name="ProfileTab"
          component={createTabScreenWrapper(Profile)}
          options={{
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: focused ? 'white' : '#9AA0A6',
                  textAlign: 'center',
                }}
              >
                More
              </Text>
            ),
            tabBarIcon: ({ focused }: { focused: boolean }) => <ProfileIcon focused={focused} />
          }}
        />
        <Tabs.Screen
          name="CoinsPurchaseModal"
          component={CoinsPurchaseModal}
          options={{
            headerShown: false,
            tabBarButton: () => null, // Hide from tab bar
            tabBarItemStyle: { display: 'none' },
          }}
        />
      </Tabs.Navigator>
      </BackgroundWrapper>
    </TabNavigationContext.Provider>
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
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={TabsRoot} options={{ headerShown: false }} />
        {/* <Stack.Screen name="CardDetail" component={CardDetail} options={{headerShown:false}} /> */}
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
        <Stack.Screen name="NameChargeModal" component={NameChargeModal} options={{ presentation: 'modal', title: 'Charge' }} />
        <Stack.Screen name="StreamAccessModal" component={StreamAccessModal} options={{ presentation: 'modal', title: 'Access' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
