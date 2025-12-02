import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, BackHandler } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import CoinsHeader from '../components/CoinsHeader';
import { useSelector, useDispatch } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import { purchaseStream } from '../store/slices/streamPurchaseSlice';
import { getOwnedStreamsList } from '../store/slices/ownedStreamsSlice';
import { getCoinsBalance } from '../store/slices/authSlice';
import { ownedStreamsListSelector } from '../store/selectors/ownedStreamsSelector';
import Svg, { Circle } from 'react-native-svg';
import GradientButton from '../components/GradientButton';
import { Icons } from '../assets/images/svg';

export default function RunningFlowScreen() {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const coinsBalance = useSelector(coinsBalanceSelector);
  const dispatch = useDispatch();
  const ownedStreamsList = useSelector(ownedStreamsListSelector);
  
  // Get ownedStream from route params or find it from the refreshed list (prioritize list for updated data)
  const routeOwnedStream = route.params?.stream;
  const routeStreamId = route.params?.streamId;
  
  // If streamId is provided, find it from the list, otherwise use route params or find by id
  const ownedStream = routeStreamId 
    ? ownedStreamsList?.find((stream: any) => stream.stream_id === routeStreamId)
    : (ownedStreamsList?.find((stream: any) => stream.id === routeOwnedStream?.id) || routeOwnedStream);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);

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
    return durationMap[normalized] || '';
  };

  // Override back button to always navigate to Profile
  useLayoutEffect(() => {
    nav.setOptions({
      headerLeft: () => null, // Remove default back button
    });

    // Override navigation back behavior
    const unsubscribe = nav.addListener('beforeRemove', (e: any) => {
      // Prevent default behavior
      e.preventDefault();
      // Navigate to Profile instead
      nav.navigate('ProfileTab', { screen: 'ProfileMain' });
    });

    return unsubscribe;
  }, [nav]);

  // Handle Android hardware back button to navigate to Profile
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        nav.navigate('ProfileTab', { screen: 'ProfileMain' });
        return true; // Prevent default back behavior
      };

      // Add event listener for Android back button
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [nav])
  );

  // Set default selected duration to "hour" when ownedStream prices are available
  useEffect(() => {
    if (ownedStream?.stream?.prices && ownedStream.stream.prices.length > 0 && !selectedDuration) {
      // Find hour duration or default to first price
      const hourPrice = ownedStream.stream.prices.find((price: any) => {
        const durationName = price.duration_type?.name || price.duration_type || '';
        return durationName.toLowerCase().trim() === 'hour';
      });
      setSelectedDuration(hourPrice || ownedStream.stream.prices[0]);
    }
  }, [ownedStream?.stream?.prices]);

  useEffect(() => {
    console.log('Selected stream:', ownedStream.created_at, ownedStream.expires_at, '..........................expires_at..........................');
    
    if (!ownedStream?.created_at || !ownedStream?.expires_at) return;

    const updateTimer = () => {
      const startTime = new Date(ownedStream.created_at).getTime();
      const endTime = new Date(ownedStream.expires_at).getTime();
      const currentTime = new Date().getTime();
      const totalDuration = endTime - startTime;
      const elapsed = currentTime - startTime;
      const remaining = Math.max(0, endTime - currentTime);
      
      setIsActive(currentTime < endTime);
      setRemainingTime(remaining);
      setProgress(Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)));
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [ownedStream, ownedStreamsList]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const onExtendFlow = () => {
    // Check if a duration is selected
    if (!selectedDuration) {
      Alert.alert(
        t('common.error'),
        'Please select a duration option',
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Check if user has sufficient coins balance
    if (coinsBalance === 0 || coinsBalance < selectedDuration.price_coins) {
      Alert.alert(
        t('common.insufficientCoins'),
        'You need coins to extend this stream. Would you like to buy coins?',
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
      t('common.confirmStreamPurchase', { price: selectedDuration.price_coins }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.yesBuy'), 
          onPress: () => {
            // Purchase stream extension
            if (ownedStream?.stream?.id && ownedStream?.stream?.title) {
              dispatch(purchaseStream(
                ownedStream.stream.id, 
                ownedStream.stream.title, 
                selectedDuration.price_coins, 
                selectedDuration.duration_type_id,
                async () => {
                  // Refresh owned streams list and coins balance
                  await dispatch(getOwnedStreamsList() as any);
                  await dispatch(getCoinsBalance() as any);
                  Alert.alert(t('common.streamSuccessful'));
                }
              ) as any);
            }
          }
        }
      ]
    );
  };

  const CircularProgress = ({ progress, size = 200, strokeWidth = 10, active, remainingTime: time }: { progress: number, size?: number, strokeWidth?: number, active: boolean, remainingTime: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const center = size / 2;
    const progressColor = active ? '#34D399' : '#FF6B6B';
    const bgColor = active ? '#0A3941' : '#0A3941';

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
            {formatTime(time)}
          </Text>
          <Text style={[styles.timerLabel, { color: theme.colors.subtext }]}>
            {active ? t('common.timeRemaining') : t('common.expired')}
          </Text>
        </View>
      </View>
    );
  };

  const handleBackToProfile = () => {
    nav.navigate('ProfileTab', { screen: 'ProfileMain' });
  };

  return (
    <ImageBackground 
      source={require('../assets/images/onboard.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <CoinsHeader onBackPress={handleBackToProfile} />
      <View style={styles.container}>
        <Text style={styles.title}>{t('common.flowIsRunning')}</Text>

        {ownedStream && (
          <View style={styles.streamInfo}>
            {/* {ownedStream.stream && (
              <Text style={styles.streamTitle}>{ownedStream.stream.title}</Text>
            )} */}
             <View style={styles.statusContainer}>
              <View style={{width:8,height:8,borderRadius:999,backgroundColor:isActive ? '#34D399' : '#FF6B6B', }}></View>
              <Text style={[
                styles.statusText,
                isActive ? styles.statusActive : styles.statusInactive
              ]}>
                {isActive ? t('common.flowActive') : t('common.inactive')}
              </Text>
            </View>

            <CircularProgress 
              progress={progress} 
              size={220} 
              strokeWidth={12} 
              active={isActive}
              remainingTime={remainingTime}
            />

            <GradientButton 
              title="EXTEND FLOW" 
              onClickButton={onExtendFlow}
              colors={['rgba(0, 198, 255, 1)', 'rgba(0, 114, 255, 1)']}
              buttonStyle={styles.extendButton}
              icon={<Icons.Flesh width={24} height={24} />}
              textStyle={{color:'white',fontSize:16,fontWeight:'600',paddingHorizontal:0}}
            />

            {ownedStream?.stream?.prices && ownedStream.stream.prices.length > 0 && (
              <View style={styles.durationButtonsContainer}>
                {ownedStream.stream.prices.map((price: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.durationButton,
                      (selectedDuration?.duration_type?.id === price.duration_type?.id || 
                       selectedDuration?.duration_type_id === price.duration_type_id ||
                       (selectedDuration?.duration_type === price.duration_type)) && styles.durationButtonSelected
                    ]}
                    onPress={() => setSelectedDuration(price)}
                  >
                    <Text style={[
                      styles.durationButtonText,
                      (selectedDuration?.duration_type?.id === price.duration_type?.id || 
                       selectedDuration?.duration_type_id === price.duration_type_id ||
                       (selectedDuration?.duration_type === price.duration_type)) && styles.durationButtonTextSelected
                    ]}>
                      {getDurationTranslation(price.duration_type?.name || price.duration_type) ? t(getDurationTranslation(price.duration_type?.name || price.duration_type)) : (price.duration_type?.name || price.duration_type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedDuration && selectedDuration.price_coins && (
              <View style={styles.priceContainer}>
                <Icons.YellowCoins width={24} height={24} />
                <Text style={styles.priceText}>{selectedDuration.price_coins}</Text>
              </View>
            )}

            {/* {ownedStream.created_at && (
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Started:</Text>
                <Text style={styles.dateText}>{formatDate(ownedStream.created_at)}</Text>
              </View>
            )} */}
            {/* {(ownedStream.duration_hours !== undefined || ownedStream.stream?.duration_hours !== undefined || ownedStream.stream?.duration !== undefined) && (
              <View style={styles.durationContainer}>
                <Text style={styles.durationLabel}>Duration:</Text>
                <Text style={styles.durationText}>
                  {ownedStream.duration_hours !== undefined 
                    ? `${ownedStream.duration_hours} hour${ownedStream.duration_hours !== 1 ? 's' : ''}`
                    : ownedStream.stream?.duration_hours !== undefined 
                    ? `${ownedStream.stream.duration_hours} hour${ownedStream.stream.duration_hours !== 1 ? 's' : ''}`
                    : ownedStream.stream?.duration !== undefined
                    ? `${ownedStream.stream.duration} hour${ownedStream.stream.duration !== 1 ? 's' : ''}`
                    : ''}
                </Text>
              </View>
            )} */}
            {ownedStream.stream?.description && (
              <Text style={styles.streamDescription}>{ownedStream.stream.description}</Text>
            )}
          </View>
        )}
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
   // justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textAlign: 'center',
    width: '100%',
  //  marginBottom: 24,
  },
  streamInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  streamTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
    marginBottom: 12,
    textAlign: 'center',
  },
  streamDescription: {
    color: theme.colors.subtext,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  dateContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  dateLabel: {
    color: theme.colors.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
  },
  durationContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  durationLabel: {
    color: theme.colors.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
  },
  statusContainer: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    flexDirection:'row',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth:1,
    paddingHorizontal: 32,
    paddingVertical: 8,
gap:16,
    borderRadius: 999,

  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
  },
  statusActive: {
    color: '#34D399',
    borderColor:'rgba(16, 185, 129, 0.2)',
    fontSize:12,
    fontWeight:'700',
    fontFamily: getFontFamily('700'),
  },
  statusInactive: {
    color: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  extendButton: {
    marginTop: 24,
    width:250,
    marginBottom: 16,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
   // width: '100%',
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
  durationButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding:8,
    marginTop: 16,
    borderWidth :1,
    borderColor:'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    justifyContent: 'center',
    backgroundColor:'rgba(15, 17, 26, 0.5)',
    borderRadius:16
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

