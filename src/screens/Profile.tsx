
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,ImageBackground, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useApp } from '../store/app';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, getCoinsBalance } from '../store/slices/authSlice';
import { getCardList } from '../store/slices/cardSlice';
import { getStreamList } from '../store/slices/streamSlice';
import { getCategoriesList } from '../store/slices/categoriesSlice';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import BackgroundWrapper from '../components/BackgroundWrapper';
import CoinsHeader from '../components/CoinsHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ownedCardsListSelector, ownedCardsLoadingSelector } from '../store/selectors/ownedCardsSelector';
import { getOwnedCardsList } from '../store/slices/ownedCardsSlice';
import { ownedStreamsListSelector, ownedStreamsLoadingSelector } from '../store/selectors/ownedStreamsSelector';
import { getOwnedStreamsList } from '../store/slices/ownedStreamsSlice';
import { OwnedStreamTile, StreamTile } from '../components/StreamTile';
import { CardTile } from '../components/CardTile';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const lang = useApp(s=>s.lang);
  const setLang = useApp(s=>s.setLang);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const set = (l: any) => { 
    setLang(l); 
    i18n.changeLanguage(l);
    // Refresh API data with new tenant slug
    dispatch(getCardList() as any);
    dispatch(getStreamList() as any);
    dispatch(getCategoriesList() as any);
    dispatch(getCoinsBalance() as any);
  };

   const ownedCards = useSelector(ownedCardsListSelector);
    const loadingOwnedCards = useSelector(ownedCardsLoadingSelector);
  const ownedStreams = useSelector(ownedStreamsListSelector);
  const loadingOwnedStreams = useSelector(ownedStreamsLoadingSelector);
  console.log(ownedCards,'ownedCards');
  
    // Fetch owned cards and streams on component mount
    useEffect(() => {
      dispatch(getOwnedCardsList() as any);
      dispatch(getOwnedStreamsList() as any);
    }, [dispatch]);

  useEffect(() => {
    const logAsyncStorage = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const storedUserEmail = await AsyncStorage.getItem('userEmail');
        
        console.log('=== AsyncStorage Data ===');
        console.log('accessToken:', accessToken);
        console.log('userEmail:', storedUserEmail);
        console.log('========================');
        
        // Set user information for display
        if (storedUserEmail) {
          const parsedData = JSON.parse(storedUserEmail);
          
          // Handle both string and object formats
          if (typeof parsedData === 'string') {
            setUserEmail(parsedData);
            setUserName(parsedData.split('@')[0]);
          } else if (typeof parsedData === 'object' && parsedData.email) {
            setUserEmail(parsedData.email);
            setUserName(parsedData.name || parsedData.email.split('@')[0]);
          }
        }
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      }
    };

    logAsyncStorage();
  }, []);

  const handleLogout = () => {
    console.log('Logout button pressed'); // Debug log
    try {
      Alert.alert(
        t('common.logout'),
        t('common.confirmLogout'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('common.logout'), 
            onPress: () => {
              console.log('Logout confirmed, navigating to Login'); // Debug log
              dispatch(signOut() as any);
              nav.navigate('Login');
            }
          }
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log('Alert error:', error);
      // Fallback: navigate directly to login
      nav.navigate('Login');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('common.deleteAccount'),
      t('common.confirmDeleteAccount'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual account deletion logic
            Alert.alert(t('common.accountDeleted'), t('common.accountDeletedSuccess'));
            nav.navigate('Login');
          }
        }
      ]
    );
  };

  return (
    <BackgroundWrapper>
      <CoinsHeader showArrow={false} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
     <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}><Text style={styles.title}>{'More'}</Text>
      <TouchableOpacity onPress={() => nav.navigate('MyProfile')}>
        <ImageBackground source={require('../assets/images/gradient.png')} 
        >
          <Text style={{color:'#fff', fontSize: 20, fontWeight:'700',paddingVertical:12,paddingHorizontal:32}}>{'My profile'}</Text>
        </ImageBackground>
      </TouchableOpacity></View> 
      {/* {userEmail && (
        <View style={styles.userInfoCard}>
          <Text style={styles.userInfoLabel}>{t('profile.userInfo')}</Text>
          <Text style={styles.userInfoText}>{t('profile.nameLabel')} {userName}</Text>
          <Text style={styles.userInfoText}>{t('profile.emailLabel')} {userEmail}</Text>
        </View>
      )} */}
      
      {/* <View style={styles.card}><Text style={styles.row}>{t('profile.language')}</Text>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {(['ru','en','es','de'] as const).map(l => (
            <TouchableOpacity key={l} onPress={()=>set(l)} style={[styles.lang, lang===l && styles.langActive]}>
              <Text style={[styles.langText, lang===l && styles.langTextActive]}>{t('langs.'+l)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View> */}
      {/* <TouchableOpacity style={styles.card} onPress={() => nav.navigate('MyCards')}>
        <Text style={styles.row}>{t('profile.myCards')}</Text>
      </TouchableOpacity>
       */}
      
      {/* <TouchableOpacity style={styles.card} onPress={() => nav.navigate('MyStreams')}>
        <Text style={styles.row}>{t('common.myStreams')}</Text>
      </TouchableOpacity> */}
      <Text style={styles.sectionTitle}>Your collection</Text>
      
      {/* Horizontal owned cards section */}
      {ownedCards && ownedCards.length > 0 && (
        <View style={styles.ownedCardsSection}>
          <ScrollView 
           horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalScrollContent, {gap: 16}]}
            style={[styles.horizontalScroll, {gap: 16}]}
            nestedScrollEnabled={true}
          >
            {ownedCards.map((ownedCard: any) => {
              const imageSource = ownedCard?.card?.video === '/images/default.jpg'
                ? require('../assets/images/flowImage.jpg')
                : { uri: 'http://api.go2winbet.online' + ownedCard?.card?.video };
              
              return (
              <React.Fragment key={`card-${ownedCard.id}`}>
                {/* <TouchableOpacity
                  style={styles.horizontalCard}
                  onPress={() => nav.navigate('ImageGallery', { 
                    images: ownedCard.card.video === '/images/default.jpg' 
                      ? [require('../assets/images/flowImage.jpg')]
                      : ['http://api.go2winbet.online' + ownedCard.card.video], 
                    initialIndex: 0 
                  })}
                  activeOpacity={0.8}
                >
                
                  <View style={styles.horizontalCardInfo}>
                    <Text style={styles.horizontalCardTitle} numberOfLines={1}>
                      {ownedCard.card.title}
                    </Text>
                    <Text style={styles.horizontalCardName} numberOfLines={1}>
                      👤 {ownedCard.name}
                    </Text>
                  </View>
                </TouchableOpacity> */}
              <CardTile
                style={{maxWidth: 145}}
                  title={ownedCard?.card?.title}
                  image={ownedCard?.card?.image}
                  price={ownedCard.coins_spent}
                  intensity={ownedCard?.card?.intensity}
               //   useCases={ownedCard.card.use_cases}
                  onPress={() => nav.navigate('ImageGallery', { 
                    images: ownedCard.card.video === '/images/default.jpg' 
                      ? [require('../assets/images/flowImage.jpg')]
                      : ['http://api.go2winbet.online' + ownedCard.card.video], 
                    initialIndex: 0 
                  })}/>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Horizontal owned streams section */}
      {ownedStreams && ownedStreams.length > 0 && (
        <View style={styles.ownedCardsSection}>
          <Text style={[styles.sectionTitle, {paddingBottom: 22}]}>{t('profile.joinedFlows')}</Text>
          <ScrollView 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScroll}
            nestedScrollEnabled={true}
          >
            {ownedStreams.map((ownedStream: any) => {
              const imageSource = ownedStream?.stream?.image === '/images/default.jpg'
                ? require('../assets/images/flowImage.jpg')
                : { uri: 'http://api.go2winbet.online' + ownedStream?.stream?.image };
              
              return (
              <React.Fragment key={`stream-${ownedStream.id}`}>
               <TouchableOpacity
                //  style={styles.horizontalCard}
                  onPress={() => nav.navigate('ImageGallery', { 
                    images: ownedStream?.stream?.image === '/images/default.jpg' 
                      ? [require('../assets/images/flowImage.jpg')]
                      : ['http://api.go2winbet.online' + ownedStream?.stream?.image], 
                    initialIndex: 0 
                  })}
                  activeOpacity={0.8}
                >
                  {/* <Image
                    source={imageSource}
                    resizeMode="cover"
                    style={styles.horizontalCardImage}
                  /> */}
                  {/* <View style={styles.horizontalCardInfo}>
                    <Text style={styles.horizontalCardTitle} numberOfLines={1}>
                      {ownedStream.stream.title}
                    </Text>
                    <Text style={styles.horizontalCardName} numberOfLines={1}>
                      💰 {ownedStream.coins_spent} coins
                    </Text>
                    {ownedStream.stream.category && (
                      <Text style={styles.horizontalCardCategory} numberOfLines={1}>
                        {ownedStream.stream.category.name}
                      </Text>
                    )}
                  </View> */}
                </TouchableOpacity>
                <OwnedStreamTile
                  title={ownedStream?.stream?.title}
               //   price={ownedStream.coins_spent}
                  intensity={ownedStream?.stream?.intensity}
                  useCases={ownedStream?.stream?.use_cases}
                  onPress={() => {
                    nav.navigate('StreamsTab', {
                      screen: 'RunningFlowScreen',
                      params: { stream: ownedStream }
                    });
                  }}
                />
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* <View style={styles.actionsContainer}>
        <PrimaryButton 
          label={t('profile.logout')} 
          onPress={handleLogout}
          style={styles.logoutButton}
        />
        <GhostButton 
          label={t('profile.deleteAccount')} 
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
        />
      </View> */}
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: 'transparent' },
  scrollContent: { padding:16, paddingBottom: 32 },
  title: { color:'#fff', fontSize: 36, fontWeight:'700' },
  userInfoCard: { 
    borderColor: theme.colors.border, 
    borderWidth:2, 
    borderRadius:16, 
    padding:12, 
    marginTop:25,
    backgroundColor: theme.colors.card
  },
  userInfoLabel: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700',
    marginBottom: 8
  },
  userInfoText: { 
    color: theme.colors.subtext, 
    fontSize: 14,
    marginBottom: 4
  },
  card: { borderColor: theme.colors.border, borderWidth:2, borderRadius:16, padding:12, marginTop:12 },
  row: { color: theme.colors.subtext },
  lang: { borderColor: theme.colors.border, borderWidth:2, borderRadius:20, paddingHorizontal:12, paddingVertical:8, marginRight:8, marginTop:8 },
  langActive: { backgroundColor: '#fff' },
  langText: { color: '#fff', fontWeight:'800' },
  langTextActive: { color: '#000' },
  actionsContainer: {
    marginTop: 32,
    gap: 12,
  },
  logoutButton: {
    flex: 0,
    alignSelf: 'center',
    minWidth: 200,
  },
  deleteButton: {
    flex: 0,
    alignSelf: 'center',
    minWidth: 200,
  },
  ownedCardsSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  //  marginBottom: 12,
    marginLeft: 4,
    paddingTop: 32,
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
  },
  horizontalCard: {
    width: '100%',
   // height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2A263E',
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: 12,
  },
  horizontalCardImage: {
    width: '100%',
    height: '70%',
    backgroundColor: theme.colors.card,
  },
  horizontalCardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  horizontalCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  horizontalCardName: {
    color: theme.colors.subtext,
    fontSize: 12,
  },
  horizontalCardCategory: {
    color: theme.colors.primary,
    fontSize: 11,
    marginTop: 2,
  },
});
