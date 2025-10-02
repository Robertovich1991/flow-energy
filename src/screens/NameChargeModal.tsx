
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../store/app';

export default function NameChargeModal() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [name, setName] = useState('');
  const charge = useApp(s => s.chargeCardName);

  const onConfirm = () => {
    charge(id, name || '—');
    nav.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Зарядка на имя</Text>
      <Text style={styles.sub}>Введите имя человека, на которого зарядить карту.</Text>
      <TextInput placeholder={t('fields.name') as string} placeholderTextColor="#AAA" value={name}
        onChangeText={setName} style={styles.input} />
      <PrimaryButton label={t('cta.confirm')} onPress={onConfirm} style={styles.confirmButton} />
      <Text style={styles.note}>{t('messages.cardWillBeReady')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding:16 },
  title: { color:'#fff', fontSize:28, fontWeight:'900' },
  sub: { color: theme.colors.subtext, marginTop:8 },
  input: { marginTop:12, borderWidth:2, borderColor: theme.colors.border, borderRadius:16, padding:12, color:'#fff' },
  confirmButton: { 
    flex: 0, 
    alignSelf: 'center',
    minWidth: 200,
    marginTop: 20
  },
  note: { color: theme.colors.subtext, marginTop:12 }
});
