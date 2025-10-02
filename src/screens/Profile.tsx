
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useApp } from '../store/app';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton, GhostButton } from '../components/Buttons';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const nav = useNavigation<any>();
  const lang = useApp(s=>s.lang);
  const setLang = useApp(s=>s.setLang);

  const set = (l: any) => { setLang(l); i18n.changeLanguage(l); };

  const handleLogout = () => {
    console.log('Logout button pressed'); // Debug log
    try {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Logout', 
            onPress: () => {
              console.log('Logout confirmed, navigating to Login'); // Debug log
              // TODO: Implement actual logout logic (clear tokens, etc.)
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
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual account deletion logic
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            nav.navigate('Login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('tabs.profile')}</Text>
      <View style={styles.card}><Text style={styles.row}>Язык:</Text>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {(['ru','en','es','de'] as const).map(l => (
            <TouchableOpacity key={l} onPress={()=>set(l)} style={[styles.lang, lang===l && styles.langActive]}>
              <Text style={[styles.langText, lang===l && styles.langTextActive]}>{t('langs.'+l)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}><Text style={styles.row}>Мои карты</Text></View>
      <View style={styles.card}><Text style={styles.row}>Подписка — безлимитные потоки</Text></View>
      
      <View style={styles.actionsContainer}>
        <PrimaryButton 
          label="Logout" 
          onPress={handleLogout}
          style={styles.logoutButton}
        />
        <GhostButton 
          label="Delete Account" 
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding:16 },
  title: { color:'#fff', fontSize: 32, fontWeight:'900' },
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
