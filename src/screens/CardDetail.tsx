
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../store/app';
import { useSelector } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import Icon from '../components/Icon';

export default function CardDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const card = route.params?.card
  const coinsBalance = useSelector(coinsBalanceSelector);
  console.log(card.image,'card.image');
  
  const buyCard = useApp(s => s.buyCard);

   const isFocused = useIsFocused();
  const isMounted = useRef(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
 const onBuy = async () => {
    console.log('[[[[[[[[[[[[[[[[[[[[[[[[');

    // Check coins balance
    if (coinsBalance === 0) {
      if (isFocused && isMounted.current) {
        Alert.alert(
          'Insufficient Coins',
          'You need coins to purchase this card. Would you like to buy coins?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Buy Coins', onPress: () => nav.navigate('CoinsPurchaseModal') },
          ]
        );
      }
      return;
    }

    await buyCard(card.id);

    if (isFocused && isMounted.current) {
      nav.navigate('NameChargeModal', { id: card.id });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{card.title}</Text>
      <ImageBackground source={{uri: 'http://api.go2winbet.online'+ card.image}} style={styles.cover} imageStyle={styles.coverImage}>
        <View style={{padding: 16, flex: 1, justifyContent: 'space-between'}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
            <Icon name="sparkle" color="#fff" />
            <Text style={{color:'#fff'}}>{card.intensityPct}%</Text>
          </View>
          <Text style={styles.coverTitle}>{card.title}</Text>
        </View>
      </ImageBackground>
      {showDescription && (
        <Text style={styles.desc}>{card.description}</Text>
      )}
      <View style={styles.actionsRow}>
        <PrimaryButton leftIcon="shopping-bag" rightIcon="arrow-right" label={t('cta.buy') + ' · $' + card.price} onPress={onBuy} />
        <GhostButton leftIcon="play" label={t('cta.preview')} onPress={()=> setShowDescription(true)} />
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="clock" size={16} color="#E0E0E6" />
          <Text style={styles.info}>5–10 мин</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="headphones" size={16} color="#E0E0E6" />
          <Text style={styles.info}>Наушники</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' },
  cover: { borderColor: theme.colors.border, borderWidth:2, borderRadius: 24, marginTop: 12, height: 200, justifyContent: 'space-between', overflow: 'hidden' },
  coverImage: { borderRadius: 24, width: '100%', height: '100%', resizeMode: 'cover' },
  coverTitle: { color:'#fff', fontSize: 28, fontWeight:'900' },
  desc: { color: theme.colors.subtext, marginTop: 16 },
  actionsRow: { flexDirection:'row', gap:10, marginTop: 12 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', marginTop: 12 },
  infoItem: { flexDirection:'row', alignItems:'center', gap:6 },
  info: { color: '#E0E0E6' },
});
