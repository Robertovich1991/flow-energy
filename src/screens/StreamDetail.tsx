import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { useDispatch } from 'react-redux';
import { purchaseStream } from '../store/slices/streamPurchaseSlice';
import { Icons } from '../assets/images/svg';
import CoinsHeader from '../components/CoinsHeader';

export default function StreamDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const stream = route.params?.stream;
  const coinsBalance = useSelector(coinsBalanceSelector);
  const dispatch = useDispatch();
  const [selectedPrice, setSelectedPrice] = useState<any>(stream.prices?.[0] || null);

  // Map API duration type name to translation key
  const getDurationTranslation = (durationName: string) => {
    if (!durationName) return '';
    const normalized = durationName.toLowerCase().trim();
    const durationMap: { [key: string]: string } = {
      'hour': 'common.hour',
      'day': 'common.day',
      'week': 'common.week',
      'month': 'common.month',
    };
    const translationKey = durationMap[normalized];
    return translationKey ? t(translationKey) : durationName;
  };
  
  const onStartStream = () => {
    // Check if a price is selected
    if (!selectedPrice) {
      Alert.alert(
        t('common.error'),
        'Please select a duration option',
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Check if user has sufficient coins balance
    if (coinsBalance === 0) {
      Alert.alert(
        t('common.insufficientCoins'),
        'You need coins to start this stream. Would you like to buy coins?',
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('common.buyCoins'), 
            onPress: () => nav.navigate('CoinsPurchaseModal')
          }
        ]
      );
      return;
    }

    // Show confirmation alert before purchasing
    Alert.alert(
      t('common.confirmPurchase'),
      t('common.confirmStreamPurchase', { price: selectedPrice.price_coins }),
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: t('common.yesBuy'), 
          onPress: () => {
            // Purchase stream access then proceed
            dispatch(purchaseStream(
              stream.id, 
              stream.title, 
              selectedPrice.price_coins, 
              selectedPrice.duration_type_id,
              () => {
                Alert.alert(t('common.streamSuccessful'));
                nav.goBack();
              }
            ) as any);
          }
        }
      ]
    );
  };

  const onGetAccess = () => {
    nav.navigate('StreamAccessModal', { streamId: stream.id });
  };
  
  // Hide header
  useEffect(() => {
    nav.setOptions({ headerShown: false });
  }, [nav]);

  // Determine which image to use
  const imageSource = stream.image === '/images/default.jpg' 
    ? require('../assets/images/flowImage.jpg')
    : { uri: 'http://api.go2winbet.online' + stream.image };

  return (
    <BackgroundWrapper>
      <CoinsHeader />
      <View style={styles.container}>
        <Text  style={{color:'white', fontSize: 30, fontWeight: '700'}}>{t('cta.connectToFlows')}</Text>
     <View style={{backgroundColor:'#101423',paddingTop:40,paddingBottom:32,borderRadius:32}}><Text style={styles.title}>{stream.title}</Text>

      {stream.prices && stream.prices.length > 0 && (
        <>
          <View style={styles.pricesContainer}>
            {stream.prices.map((price: any) => {
              const isSelected = selectedPrice?.id === price.id;
              return (
                <TouchableOpacity 
                  key={price.id} 
                  style={[
                    styles.priceButton,
                    isSelected && styles.priceButtonSelected
                  ]}
                  onPress={() => {
                    setSelectedPrice(price);
                  }}
                >
                  <Text style={[
                    styles.priceButtonTitle,
                    isSelected && styles.priceButtonTitleSelected
                  ]}>
                    {getDurationTranslation(price.duration_type?.name || '')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedPrice && (
            <View style={styles.coinsDisplay}>
              <Icons.Gold width={40} height={40} />
              {/* <Icon name="coin" size={20} color={theme.colors.primary} /> */}
              <Text style={styles.coinsText}>{selectedPrice.price_coins}</Text>
            </View>
          )}
        </>
      )}

      {/* <ImageBackground source={imageSource} style={styles.cover} imageStyle={styles.coverImage}>
        <View style={{padding: 16, flex: 1, justifyContent: 'space-between'}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
            <Icon name="play" color="#fff" />
            <Text style={{color:'#fff'}}>{t('common.stream')}</Text>
          </View>
          <Text style={styles.coverTitle}>{stream.title}</Text>
        </View>
      </ImageBackground> */}
      {/* <Text style={styles.desc}>{stream.description || 'Experience this powerful stream session designed to enhance your energy and focus.'}</Text> */}
      {/* <Text style={styles.title}>{stream.use_cases}</Text> */}

      
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.startButton} onPress={onStartStream}>
          <Text style={{color:'white', fontSize: 24, fontWeight: '700'}}>{t('cta.buy')}</Text>
        </TouchableOpacity>
        {/* <PrimaryButton 
        
          leftIcon="play" 
          rightIcon="arrow-right" 
          label={t('cta.startStream') + (selectedPrice ? ` · ${selectedPrice.price_coins} coins` : '')} 
          onPress={onStartStream} 
        /> */}
        {/** <GhostButton leftIcon="lock" label={t('cta.getAccess')} onPress={onGetAccess} /> **/}
      </View></View> 
      {/* <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="clock" size={16} color="#E0E0E6" />
          <Text style={styles.info}>10–15 мин</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="headphones" size={16} color="#E0E0E6" />
          <Text style={styles.info}>Наушники</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="play" size={16} color="#E0E0E6" />
          <Text style={styles.info}>Онлайн</Text>
        </View> */}
      {/* </View> */}
      <View></View>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0B16', padding: 16, justifyContent:'space-between' },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' ,textAlign:'center'},
  pricesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 66
  },
  priceButton: {
    width: '48%',
    backgroundColor: 'white',
    borderColor: theme.colors.border,
  //  borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceButtonSelected: {
    backgroundColor: '#4A90E2',
   // borderColor: theme.colors.primary,
  },
  priceButtonTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  startButton: {
    flex:1,
    backgroundColor: '#1ED760',
  //  width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceButtonTitleSelected: {
    color: 'white',
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  coinsText: {
    color: theme.colors.primary,
    fontSize: 36,
    fontWeight: '700',
  },
  cover: { 
    borderColor: theme.colors.border, 
    borderWidth:2, 
    borderRadius: 24, 
    marginTop: 12, 
    height: 200, 
    justifyContent: 'space-between', 
    overflow: 'hidden'
  },
  coverImage: { 
    borderRadius: 24, 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  coverTitle: { color:'#fff', fontSize: 28, fontWeight:'900' },
  desc: { color: theme.colors.subtext, marginTop: 16 },
  useCasesSection: { marginTop: 16 },
  useCasesTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  useCaseItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  useCaseBullet: { color: theme.colors.primary, fontSize: 16, marginRight: 8, marginTop: 2 },
  useCaseText: { color: theme.colors.subtext, fontSize: 14, flex: 1, lineHeight: 20 },
  actionsRow: { flexDirection:'row', gap:10, marginTop: 12 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', marginTop: 12 },
  infoItem: { flexDirection:'row', alignItems:'center', gap:6 },
  info: { color: '#E0E0E6' },
});
