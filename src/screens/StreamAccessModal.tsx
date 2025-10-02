
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../store/app';

const plans: {key: 'hour'|'day'|'week'|'month'|'year', price: number}[] = [
  {key:'hour', price: 0.99},
  {key:'day', price: 1.99},
  {key:'week', price: 3.99},
  {key:'month', price: 7.99},
  {key:'year', price: 49.99},
];

export default function StreamAccessModal() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const streamId = route.params?.id ?? 301;
  const [sel, setSel] = useState(plans[0].key);
  const grant = useApp(s => s.grantStreamAccess);

  const onGet = async () => {
    await grant(streamId, sel);
    nav.replace('StreamSession', { id: streamId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Доступ к потоку</Text>
      <Text style={styles.sub}>Выберите период доступа</Text>
      <View style={styles.grid}>
        {plans.map(p => (
          <TouchableOpacity key={p.key} onPress={()=>setSel(p.key)} style={[styles.plan, sel===p.key && styles.planActive]}>
            <Text style={[styles.planTxt, sel===p.key && styles.planTxtActive]}>{t('plans.'+p.key)}</Text>
            <Text style={[styles.price, sel===p.key && styles.priceActive]}>${p.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <PrimaryButton label={t('cta.getAccess')} onPress={onGet} style={styles.getAccessButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding:16 },
  title: { color:'#fff', fontSize:28, fontWeight:'900' },
  sub: { color: theme.colors.subtext, marginBottom: 12 },
  grid: { flexDirection:'row', flexWrap:'wrap', gap:12, marginVertical:12 },
  plan: { width:'31%', borderColor: theme.colors.border, borderWidth:2, borderRadius:20, padding:10 },
  planActive: { backgroundColor:'#EDEDF2' },
  planTxt: { color:'#EDEDF2', fontWeight:'700' },
  planTxtActive: { color:'#000' },
  price: { color:'#AAA', marginTop:6 },
  priceActive: { color:'#444' },
  getAccessButton: { 
    flex: 0, 
    alignSelf: 'center',
    minWidth: 200,
    marginTop: 20
  },
});
