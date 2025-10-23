
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
import * as RNIap from 'react-native-iap';
import { getCategoriesList } from '../store/slices/categoriesSlice';


export default function Home() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const cards = useSelector(cardListSelector);
  
 const productIds=['coin10','coin50','coin100','coin500','coin1000']
  
  useEffect(() => {
    dispatch(getCardList() as any);
    dispatch(getStreamList() as any);
    dispatch(getCategoriesList() as any);
  }, [dispatch])

  useEffect(() => {
    async function init() {
      try {
        const suc= await RNIap.initConnection();
        setTimeout(async () => {
           await RNIap.getSubscriptions({skus:productIds});
          const x= await RNIap.getProducts({skus:productIds});
         console.log(x,suc,'[[[[[[[[[[[[[[[[[[[[[[');
         
        }, 1000); // Wait 1 second        console.log(products,'[[[[[[[[gggggggggggggggggg[[[[[[[[[[[[[[')
      } catch (err) {
        console.log(err);
      }
    }
  
    init();
  
    return () => {
    //  RNIap.endConnection();
    };
   }, []);

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.brand}>Flow Up</Text>
      <Text style={styles.tagline}>{t('appTagline')}</Text>

      <View style={styles.hero}>
        <Text style={styles.heroSup}>AI • {t('sections.popular')}</Text>
        <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
        <View style={styles.ctaRow}>
          <PrimaryButton leftIcon="sparkle" rightIcon="arrow-right" label={t('cta.viewCard')} onPress={() => nav.navigate('CardsTab')} />
          <GhostButton leftIcon="play" label={t('cta.startStream')} onPress={() => nav.navigate('StreamsTab')} />
        </View>
      </View>

      <Text style={styles.section}>{t('sections.popular')}</Text>
      <View style={styles.cardsGrid}>
        {cards && cards.length > 0 && cards?.slice(0, 6).map((card: any) => (
          <CardTile
            key={card.id}
            title={card.title}
            price={`$${card.price}`}
            intensity={card.intensityPct}
            onPress={() => nav.navigate('CardDetail', { card: card })}
          />
        ))}
      </View>
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
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
