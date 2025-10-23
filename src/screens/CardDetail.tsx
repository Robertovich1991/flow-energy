
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import Video from 'react-native-video';
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
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  console.log(card.image,'card.image');
  
  const buyCard = useApp(s => s.buyCard);

   const isFocused = useIsFocused();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Set navigation title with coins balance
  useEffect(() => {
    nav.setOptions({ 
      title: t('headers.card'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <Icon name="coin" color="#fff" size={16} />
          <Text style={{ color: '#fff', marginLeft: 4, fontSize: 16, fontWeight: '600' }}>
            {coinsBalance}
          </Text>
        </View>
      )
    });
  }, [nav, t, coinsBalance]);
 const onBuy = async () => {
    console.log('[[[[[[[[[[[[[[[[[[[[[[[[');

    // Check coins balance
    if (coinsBalance === 0) {
      if (isFocused && isMounted.current) {
        Alert.alert(
          t('common.insufficientCoins'),
          'You need coins to purchase this card. Would you like to buy coins?',
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.buyCoins'), onPress: () => nav.navigate('CoinsPurchaseModal') },
          ]
        );
      }
      return;
    }

    // Show confirmation alert before purchasing
    if (isFocused && isMounted.current) {
      Alert.alert(
        t('common.confirmPurchase'),
        t('common.confirmCardPurchase', { price: card.price }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('common.yesBuy'), 
            onPress: async () => {
              await buyCard(card.id);

              if (isFocused && isMounted.current) {
                nav.navigate('NameChargeModal', { id: card.id });
              }
            }
          }
        ]
      );
    }
  };

  // Determine which image/video to use
  const isVideo = card.image && card.image.toLowerCase().endsWith('.mp4');
  const mediaSource = card.image === '/images/default.jpg' 
    ? require('../assets/images/flowImage.jpg')
    : { uri: 'http://api.go2winbet.online' + card.image };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{card.title}</Text>
      <View style={styles.imageWrapper}>
        {isVideo ? (
          <Video
            source={mediaSource}
            style={styles.cover}
            resizeMode='contain'
            paused={isVideoPaused}
            repeat={true}
            muted={true}
            onLoad={() => setIsVideoPaused(false)}
          />
        ) : (
          <Image source={mediaSource} style={styles.cover} resizeMode='contain' />
        )}
        <View style={styles.overlay}>
          <View style={{flexDirection:'row',marginLeft:35, alignItems:'center', gap:6}}>
            <Icon name="sparkle" color="#fff" />
            <Text style={{color:'#fff'}}>{card.intensityPct}%</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <PrimaryButton leftIcon="shopping-bag" rightIcon="arrow-right" label={t('cta.buy') + ' · $' + card.price} onPress={onBuy} />
      </View>
      {card.description && (
        <Text style={styles.desc}>{card.description}</Text>
      )}
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' },
  imageWrapper: { marginTop: 12, borderRadius: 20, overflow: 'hidden', alignSelf: 'center' },
  cover: { height: 440, width: 400, borderRadius: 20 },
  overlay: { position: 'absolute', top: 16, left: 16, right: 16, flex: 1, justifyContent: 'space-between' },
  // coverTitle: { color:'black', fontSize: 28, fontWeight:'900' },
  desc: { color: theme.colors.subtext, marginTop: 20, fontSize: 16, lineHeight: 24 },
  actionsRow: { flexDirection:'row', gap:10, marginTop: 12 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', marginTop: 12 },
  infoItem: { flexDirection:'row', alignItems:'center', gap:6 },
  info: { color: '#E0E0E6' },
});
