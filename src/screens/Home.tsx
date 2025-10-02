
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { CardTile } from '../components/CardTile';
import { useNavigation } from '@react-navigation/native';
import { getCardList } from '../store/slices/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { cardListSelector } from '../store/selectors/cardSelector';
import { getStreamList } from '../store/slices/streamSlice';


export default function Home() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const cards = useSelector(cardListSelector);
  
  useEffect(() => {
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    dispatch(getCardList());
    dispatch(getStreamList());
  }, [])
  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.brand}>Flow</Text>
      <Text style={styles.tagline}>{t('appTagline')}</Text>

      <View style={styles.hero}>
        <Text style={styles.heroSup}>AI • {t('sections.popular')}</Text>
        <Text style={styles.heroTitle}>«Повышение дохода» + 10 мин «Финансовая ясность»</Text>
        <View style={styles.ctaRow}>
          <PrimaryButton leftIcon="sparkle" rightIcon="arrow-right" label={t('cta.viewCard')} onPress={() => nav.navigate('CardsTab')} />
          <GhostButton leftIcon="play" label={t('cta.startStream')} onPress={() => nav.navigate('StreamsTab')} />
        </View>
      </View>

      <Text style={styles.section}>{t('sections.popular')}</Text>
      {cards && cards.slice(0, 2).map((card: any) => (
        <CardTile
          key={card.id}
          title={card.title}
          price={`$${card.price}`}
          intensity={card.intensityPct}
          onPress={() => nav.navigate('CardDetail', { card: card })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  brand: { color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 4 },
  tagline: { color: theme.colors.subtext, fontSize: 15 },
  hero: { borderColor: theme.colors.border, borderWidth: 2, borderRadius: 24, padding: 16, marginTop: 16, backgroundColor: theme.colors.card },
  heroSup: { color: theme.colors.subtext, marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '900', lineHeight: 26 },
  section: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 24, marginBottom: 8 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }
});
