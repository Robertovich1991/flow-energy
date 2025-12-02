import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import { ownedStreamsListSelector } from '../store/selectors/ownedStreamsSelector';
import { useDispatch } from 'react-redux';
import { purchaseStream } from '../store/slices/streamPurchaseSlice';
import { getOwnedStreamsList } from '../store/slices/ownedStreamsSlice';
import { Icons } from '../assets/images/svg';
import CoinsHeader from '../components/CoinsHeader';
import Svg, { Circle } from 'react-native-svg';
import GradientButton from '../components/GradientButton';

export default function StreamDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const stream = route.params?.stream;
  const coinsBalance = useSelector(coinsBalanceSelector);
  const ownedStreamsList = useSelector(ownedStreamsListSelector);
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

  // CircularProgress component showing 00:00
  const CircularProgress = ({ progress, size = 200, strokeWidth = 10 }: { progress: number, size?: number, strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const center = size / 2;
    const progressColor = '#34D399';
    const bgColor = '#0A3941';

    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        <View style={styles.timerTextContainer}>
          <Text style={[styles.timerText, { color: 'white' }]}>
            00:00
          </Text>
          <Text style={[styles.timerLabel, { color: theme.colors.subtext }]}>
            {t('common.timeRemaining')}
          </Text>
        </View>
      </View>
    );
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
              async () => {
                // Refresh owned streams list
                await dispatch(getOwnedStreamsList() as any);
                
                // Wait for Redux state to update, then navigate
                // RunningFlowScreen will find the stream from the updated list using streamId
                setTimeout(() => {
                  nav.navigate('StreamsTab', {
                    screen: 'RunningFlowScreen',
                    params: { 
                      streamId: stream.id
                    }
                  });
                }, 500);
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

  return (
    <ImageBackground 
      source={require('../assets/images/onboard.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <CoinsHeader />
      <View style={styles.container}>
        <Text style={styles.title}>{t('cta.connectToFlows')}</Text>

        <View style={styles.streamInfo}>
          <CircularProgress 
            progress={0} 
            size={220} 
            strokeWidth={12} 
          />

          <GradientButton 
            title="START FLOW" 
            onClickButton={onStartStream}
            colors={['rgba(0, 198, 255, 1)', 'rgba(0, 114, 255, 1)']}
            buttonStyle={styles.startButton}
            icon={<Icons.Flesh width={24} height={24} />}
            textStyle={{color:'white',fontSize:16,fontWeight:'600',paddingHorizontal:0}}
          />

          {stream.prices && stream.prices.length > 0 && (
            <View style={styles.durationButtonsContainer}>
              {stream.prices.map((price: any, index: number) => {
                const isSelected = selectedPrice?.id === price.id;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.durationButton,
                      isSelected && styles.durationButtonSelected
                    ]}
                    onPress={() => setSelectedPrice(price)}
                  >
                    <Text style={[
                      styles.durationButtonText,
                      isSelected && styles.durationButtonTextSelected
                    ]}>
                      {getDurationTranslation(price.duration_type?.name || price.duration_type) || (price.duration_type?.name || price.duration_type)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {selectedPrice && selectedPrice.price_coins && (
            <View style={styles.priceContainer}>
              <Icons.YellowCoins width={24} height={24} />
              <Text style={styles.priceText}>{selectedPrice.price_coins}</Text>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textAlign: 'center',
    width: '100%',
  },
  streamInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingBottom: 0,
  },
  timerText: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
  },
  startButton: {
    marginTop: 24,
    width: 250,
    marginBottom: 16,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  durationButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 17, 26, 0.5)',
    borderRadius: 16
  },
  durationButton: {
    backgroundColor: 'rgba(15, 17, 26, 0.5)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  durationButtonSelected: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#00D4C8',
  },
  durationButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: getFontFamily('500'),
    textAlign: 'center',
  },
  durationButtonTextSelected: {
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  priceText: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
});
