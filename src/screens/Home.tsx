
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import { CardTile } from '../components/CardTile';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { useNavigation } from '@react-navigation/native';
import CoinsHeader from '../components/CoinsHeader';
import { getCardList } from '../store/slices/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { cardListSelector } from '../store/selectors/cardSelector';
import { getStreamList } from '../store/slices/streamSlice';
 import * as RNIap from 'react-native-iap';
import { getCategoriesList } from '../store/slices/categoriesSlice';
import { Icons } from '../assets/images/svg';


export default function Home() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const cards = useSelector(cardListSelector);

  const productIds = ['coin10', 'coin50', 'coin100', 'coin500', 'coin1000']

  useEffect(() => {
    dispatch(getCardList() as any);
    dispatch(getStreamList() as any);
    dispatch(getCategoriesList() as any);
  }, [dispatch])

  useEffect(() => {
    async function init() {
      try {
        const suc = await RNIap.initConnection();
        setTimeout(async () => {
            await RNIap.getSubscriptions({skus:productIds});
             const x= await RNIap.getProducts({skus:productIds});
          console.log(x,suc,'[[[[[[[[[ffffffffffffffff[[[[[[[[[[[[[');

        }, 1000); // Wait 1 second        console.log(products,'[[[[[[[[gggggggggggggggggg[[[[[[[[[[[[[[')
      } catch (err) {
        console.log(err);
      }
    }

    init();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  return (
    <BackgroundWrapper>
      <CoinsHeader showArrow={false} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.brand}>{t('common.flowUp')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={styles.tagline}>{t('common.featuredEnergy')}</Text>
          <TouchableOpacity onPress={() => nav.navigate('CardsTab')}><Text style={{ color: '#4169E1', fontSize: 14, fontWeight: '400' }}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <ImageBackground source={require('../assets/images/home.png')} style={styles.hero}>
          {/* <Text style={styles.heroSup}>AI • {t('sections.popular')}</Text> */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}><View><Text style={styles.heroTitle}>{t('common.eternalFlame')}</Text>
            <Text style={{ color: '#D1D5DB', fontSize: 12, fontWeight: '400' }}>{t('common.boostsVitality')}</Text></View>
          <TouchableOpacity 
            onPress={() => {
              if (cards && cards.length > 0) {
                nav.navigate('CardDetail', { card: cards[0] });
              }
            }}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icons.ArrowButton />
          </TouchableOpacity>
          </View>
          <View style={styles.ctaRow}>
            {/* <PrimaryButton leftIcon="sparkle" rightIcon="arrow-right" label={t('cta.viewCard')} onPress={() => nav.navigate('CardsTab')} /> */}
            {/* <GhostButton leftIcon="play" label={t('cta.startStream')} onPress={() => nav.navigate('StreamsTab')} /> */}
          </View>
        </ImageBackground>

        {/* <Text style={styles.section}>{t('sections.popular')}</Text> */}
        <View style={styles.cardsGrid}>
          {cards && cards.length > 0 && cards?.slice(0, 6).map((card: any) => (
            <CardTile
              key={card.id}
              title={card.title}
              price={`$${card.price}`}
              intensity={card.intensityPct}
              image={card.image}
              style={{}}
              onPress={() => nav.navigate('CardDetail', { card: card })}
            />
          ))}
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  brand: { color: '#fff', fontSize: 40, fontWeight: '900', fontFamily: getFontFamily('900'), marginTop: 4 },
  tagline: { color: theme.colors.subtext, fontSize: 15, fontFamily: getFontFamily('400') },
  hero: { borderColor: theme.colors.border, borderRadius: 24, paddingTop: 145, paddingBottom: 28, marginTop: 16, backgroundColor: theme.colors.card },
  heroSup: { color: theme.colors.subtext, marginBottom: 6, fontFamily: getFontFamily('400') },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '900', fontFamily: getFontFamily('900'), lineHeight: 26 },
  section: { color: '#fff', fontSize: 20, fontWeight: '900', fontFamily: getFontFamily('900'), marginTop: 24, marginBottom: 8 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  cardsGrid: { marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
