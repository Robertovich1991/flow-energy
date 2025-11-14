
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useApp } from '../store/app';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { signOut, getCoinsBalance } from '../store/slices/authSlice';
import { getCardList } from '../store/slices/cardSlice';
import { getStreamList } from '../store/slices/streamSlice';
import { getCategoriesList } from '../store/slices/categoriesSlice';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import BackgroundWrapper from '../components/BackgroundWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <View style={styles.container}>
      <Text style={styles.title}>{t('tabs.profile')}</Text>
      
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
      <TouchableOpacity style={styles.card} onPress={() => nav.navigate('MyCards')}>
        <Text style={styles.row}>{t('profile.myCards')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => nav.navigate('MyStreams')}>
        <Text style={styles.row}>{t('common.myStreams')}</Text>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
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
      </View>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: 'transparent', padding:16 },
  title: { color:'#fff', fontSize: 32, fontWeight:'900' },
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
});
