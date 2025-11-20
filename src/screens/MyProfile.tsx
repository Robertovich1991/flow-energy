
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

export default function MyProfile() {
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
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
     <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}><Text style={styles.title}>{'Profile'}</Text>
     </View> 
      {userEmail && (
        <View style={styles.userInfoCard}>
          <Text style={styles.userInfoLabel}>{t('profile.userInfo')}</Text>
          <Text style={styles.userInfoText}>{t('profile.nameLabel')} {userName}</Text>
          <Text style={styles.userInfoText}>{t('profile.emailLabel')} {userEmail}</Text>
        </View>
      )}
      
      <View style={styles.card}><Text style={styles.row}>{t('profile.language')}</Text>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {(['ru','en','es','de'] as const).map(l => (
            <TouchableOpacity key={l} onPress={()=>set(l)} style={[styles.lang, lang===l && styles.langActive]}>
              <Text style={[styles.langText, lang===l && styles.langTextActive]}>{t('langs.'+l)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    
      <View style={styles.spacer} />
   
      <View style={styles.actionsContainer}>
      <TouchableOpacity style={{backgroundColor: '#00D4C8', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16}} onPress={handleLogout}>
        <Text style={{color: '#fff',textAlign: 'center', fontSize: 16, fontWeight: '700'}}>{t('profile.logout')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor: '#D91B72', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16}} onPress={handleDeleteAccount}>
        <Text style={{color: '#fff',textAlign: 'center', fontSize: 16, fontWeight: '700'}}>{t('profile.deleteAccount')}</Text>
      </TouchableOpacity>
        {/* <GhostButton 
          label={t('profile.deleteAccount')} 
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
        /> */}
      </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: 'transparent' },
  scrollContent: { padding:16, paddingBottom: 32, flexGrow: 1 },
  spacer: { flex: 1, minHeight: 100 },
  title: { color:'#fff', fontSize: 36, fontWeight:'700' },
userInfoCard: { 
    borderColor: '#161E31', 
    borderRadius:16, 
    padding:12, 
    marginTop:25,
    backgroundColor: '#161E31'
  },
  userInfoLabel: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '400',
    marginBottom: 8
  },
  userInfoText: { 
    color: theme.colors.subtext, 
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4
  },
  card: { backgroundColor: '#161E31', borderRadius:16, padding:12, marginTop:12 },
  row: { color: '#fff',fontSize: 20, fontWeight: '400' },
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
