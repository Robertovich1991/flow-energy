import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, ImageBackground, Touchable, TouchableOpacity, Modal, Platform, TextInput, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton, SubmitButton } from '../components/Buttons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../store/app';
import { useDispatch, useSelector } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import Icon from '../components/Icon';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { RootState } from '../store/config/configStore';
import { purchaseCard } from '../store/slices/cardPurchaseSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { set } from 'react-hook-form';

export default function CardDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const card = route.params?.card
  const coinsBalance = useSelector(coinsBalanceSelector);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [cachedVideoUri, setCachedVideoUri] = useState(null);
  const [cachedImageUri, setCachedImageUri] = useState(null);
  console.log(card.image, 'card.image');
  const dispatch = useDispatch();
  const buyCard = useApp(s => s.buyCard);

  const isFocused = useIsFocused();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Set navigation title with coins balance and background
  useEffect(() => {
    nav.setOptions({
      title: t('headers.card'),
      headerBackground: () => (
        <ImageBackground
          style={{ flex: 1, backgroundColor: '#161427' }}
          resizeMode="cover"
          imageStyle={{ opacity: 0.8 }}
        />
      ),
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
                setModalVisible(true)
                //  ('NameChargeModal', { id: card.id });
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

  // Video caching logic
  useEffect(() => {
    if (isVideo && card.image !== '/images/default.jpg') {
      const videoUrl = 'http://api.go2winbet.online' + card.image;
      const fileName = card.image.split('/').pop();
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      // Check if video is already cached
      RNFS.exists(localPath).then(exists => {
        if (exists) {
          // Cached video - set immediately and skip loading
          setCachedVideoUri({ uri: `file://${localPath}` });
          setIsVideoLoading(false);
          setIsVideoPaused(false); // Start playing immediately
        } else {
          // Not cached - start loading and download
          setIsVideoLoading(true);
          const downloadOptions = {
            fromUrl: videoUrl,
            toFile: localPath,
            background: true,
            discretionary: true,
            progress: (res) => {
              console.log('Download progress:', res.bytesWritten / res.contentLength);
            }
          };

          RNFS.downloadFile(downloadOptions).promise
            .then(() => {
              setCachedVideoUri({ uri: `file://${localPath}` });
              setIsVideoLoading(false);
              setIsVideoPaused(false);
            })
            .catch(error => {
              console.log('Download error:', error);
              setVideoError(true);
              setIsVideoLoading(false);
            });
        }
      });
    } else if (!isVideo) {
      setIsVideoLoading(false);
    }
  }, [isVideo, card.image]);

  // Image caching logic
  useEffect(() => {
    if (!isVideo && card.image !== '/images/default.jpg') {
      const imageUrl = 'http://api.go2winbet.online' + card.image;
      const fileName = card.image.split('/').pop();
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      // Check if image is already cached
      RNFS.exists(localPath).then(exists => {
        if (exists) {
          // Cached image - set immediately
          setCachedImageUri({ uri: `file://${localPath}` });
        } else {
          // Not cached - download and cache
          const downloadOptions = {
            fromUrl: imageUrl,
            toFile: localPath,
            background: true,
            discretionary: true,
            progress: (res) => {
              console.log('Image download progress:', res.bytesWritten / res.contentLength);
            }
          };

          RNFS.downloadFile(downloadOptions).promise
            .then(() => {
              setCachedImageUri({ uri: `file://${localPath}` });
            })
            .catch(error => {
              console.log('Image download error:', error);
            });
        }
      });
    }
  }, [isVideo, card.image]);

  // const id = route.params?.id;
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const charge = useApp(s => s.chargeCardName);
  const isLoading = useSelector((state: RootState) => state.cardPurchaseReducer.loading);
  const error = useSelector((state: RootState) => state.cardPurchaseReducer.error);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Purchase Error', error);
    }
  }, [error]);

  const onConfirm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    charge(card.id, name || '—');

    // Format birthday as YYYY-MM-DD
    const formattedBirthday = birthday.toISOString().split('T')[0];

    // Call purchase endpoint with name, surname and birthday, then navigate back
    dispatch(purchaseCard(card.id, name, surname, formattedBirthday, () => {
      // Alert.alert('Successfully');
      setModalVisible(false);
      setSuccessModalVisible(true);
      return
      //  nav.goBack();
    }) as any);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };


  return (
    <>
      <BackgroundWrapper>
       <ScrollView style={styles.container}>
        <View style={styles.imageWrapper}>
            {!successModalVisible && (isVideo ? (
              <View style={styles.cover}>
                <Video
                  source={cachedVideoUri || mediaSource}
                  style={styles.cover}
                  resizeMode='contain'
                  paused={isVideoPaused}
                  repeat={true}
                  muted={true}
                  playInBackground={false}
                  playWhenInactive={false}
                  ignoreSilentSwitch="ignore"
                  onLoad={() => {
                    setIsVideoLoading(false);
                    setVideoError(false);
                  }}
                  onLoadStart={() => {
                    setIsVideoLoading(true);
                    setVideoError(false);
                  }}
                  onError={(error) => {
                    console.log('Video error:', error);
                    setVideoError(true);
                    setIsVideoLoading(false);
                  }}
                  onBuffer={({ isBuffering }) => {
                    // Only show loading for non-cached videos
                    if (!cachedVideoUri) {
                      setIsVideoLoading(isBuffering);
                    }
                  }}
                />
                {isVideoLoading && (
                  <View style={styles.loadingOverlay}>
                  </View>
                )}
                {videoError && (
                  <View style={styles.errorOverlay}>
                    <Text style={styles.errorText}>Video unavailable</Text>
                  </View>
                )}
              </View>
            ) : (
              <Image source={cachedImageUri || mediaSource} style={styles.cover} resizeMode='contain' />
           ) )}
            {/* <View style={styles.overlay}>
              <View style={{ flexDirection: 'row', marginLeft: 35, alignItems: 'center', gap: 6 }}>
                <Icon name="sparkle" color="#fff" />
                <Text style={{ color: '#fff' }}>{card.intensityPct}%</Text>
              </View>
            </View> */}
          </View>
         {!successModalVisible && <Text style={styles.title}>{card.title}</Text>}

         {!successModalVisible && <View style={styles.actionsRow}>
            <TouchableOpacity style={{ width: '50%', backgroundColor: '#00B149DE', paddingVertical: 0, paddingHorizontal: 52, borderRadius: 14 }} onPress={onBuy}>
              <Text style={{ lineHeight: 38, color: "white", textAlign: 'center', fontSize: 32, fontWeight: '900', paddingVertical: 12 }}>{t('cta.buy')}</Text>
            </TouchableOpacity>
            <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}><View style={{ backgroundColor: '#FBBF24', width: 16, height: 16, borderRadius: 90 }}></View>
              <Text style={{ color: "white", fontSize: 32, fontWeight: '900' }}>{card.price}</Text>
            </View> {/* <PrimaryButton leftIcon="shopping-bag" rightIcon="arrow-right" label={t('cta.buy') + ' · $' + card.price} onPress={onBuy} /> */}
          </View>}
          {/* {card.description && (
          <Text style={styles.desc}>{card.description}</Text>
        )} */}

        </ScrollView>

      </BackgroundWrapper>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.bottomSheet}>
                <Text style={styles.title}>Activation</Text>
                <Text style={styles.label}>Name</Text>

                <TextInput
                  //  placeholder={t('fields.name') as string}
                  // placeholderTextColor="#AAA"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />

                <Text style={styles.label}>Surname</Text>

                <TextInput
                  placeholderTextColor="#AAA"
                  value={surname}
                  onChangeText={setSurname}
                  style={styles.input}
                />

                <Text style={styles.label}>Date of Birth</Text>

                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>
                    {birthday.toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    textColor="#fff"
                    themeVariant="dark"
                  />
                )}

                <SubmitButton
                  label={'ACTIVATE'}
                  onPress={onConfirm}
                  style={styles.confirmButton}
                  disabled={!!isLoading}
                  loading={!!isLoading}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={successModalVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={[styles.modalBackground,{justifyContent:'center',alignItems:'center'}]}>
            <TouchableWithoutFeedback>
              <View style={[styles.bottomSheet,{backgroundColor:'#0D0B16'}]}>

                <Image source={require('../assets/images/congrats.png')} style={{ width: Dimensions.get('window').width-50, height: 400, alignSelf: 'center' }} />

                <SubmitButton
                  label={'OK'}
                  onPress={()=>setSuccessModalVisible(false)}
                  style={[styles.confirmButton, { borderRadius: 36 ,marginHorizontal:60}]}
                  disabled={!!isLoading}
                  loading={!!isLoading}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#161427' },
  title: { color: '#fff', fontSize: 30, fontWeight: '700', textAlign: 'center',letterSpacing:1.5 },
  imageWrapper: {backgroundColor:'red', borderRadius: 20, overflow: 'hidden', alignSelf: 'center', },
  cover: { height: 600, width: 400, borderRadius: 20, overflow: 'hidden' },
  // overlay: { position: 'absolute', top: 16, left: 16, right: 16, flex: 1, justifyContent: 'space-between' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#1C192B',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 80
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600'
  },
  // coverTitle: { color:'black', fontSize: 28, fontWeight:'900' },
  desc: { color: theme.colors.subtext, marginTop: 20, fontSize: 16, lineHeight: 24 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12, paddingHorizontal: 16, alignItems: 'center', },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  info: { color: '#E0E0E6' },
  sub: { color: theme.colors.subtext, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#5A5A6A', borderRadius: 8, padding: 12, color: '#fff' },
  label: {
    color: '#B0B0C0',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 20,
    marginBottom: 8
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#5A5A6A', borderRadius: 8,
    padding: 12,
    //  backgroundColor: 'rgba(255,255,255,0.1)'
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16
  },
  confirmButton: {
    // alignSelf: 'center',
    backgroundColor: '#00B149DE',
    marginTop: 40,
  },
  note: { color: theme.colors.subtext, marginTop: 12 }
});