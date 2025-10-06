
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { CardTile } from '../components/CardTile';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { streamListSelector } from '../store/selectors/streamSelector';

export default function Streams() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
const streams = useSelector(streamListSelector)
console.log(streams,'............jjjjj.................');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.streams')}</Text>
      {streams?.map((stream: any) => (
          <CardTile
            key={stream.id}
            title={stream.title}
            price={stream.price}
            intensity={stream.intensity}
            onPress={() => nav.navigate('StreamDetail', { stream: stream })}
          />
        ))}
     
      <TouchableOpacity style={styles.cta} onPress={() => nav.navigate('StreamAccessModal', { id:301 })}>
        <Text style={styles.ctaText}>{t('cta.getAccess')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' },
  cta: { alignSelf:'flex-end', paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:'#000', marginTop:8 },
  ctaText: { color:'#fff', fontWeight:'800' }
});
