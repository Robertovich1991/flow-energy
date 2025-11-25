import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, ImageBackground, Touchable, TouchableOpacity, Modal, Platform, TextInput, TouchableWithoutFeedback, Dimensions, StatusBar } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton, SubmitButton } from '../components/Buttons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/app';
import { useDispatch, useSelector } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import Icon from '../components/Icon';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { RootState } from '../store/config/configStore';
import { purchaseCard } from '../store/slices/cardPurchaseSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { set } from 'react-hook-form';
import CoinsHeader from '../components/CoinsHeader';
import GradientButton from '../components/GradientButton';
import { Icons } from '../assets/images/svg';

export default function CardDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [descriptionY, setDescriptionY] = useState<number>(0);
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

  // Determine which image/video to use - prioritize video over image
  const videoSource = card.video || card.image;
  const isVideo = videoSource && videoSource.toLowerCase().endsWith('.mp4');
  const mediaSource = videoSource === '/images/default.jpg'
    ? require('../assets/images/flowImage.jpg')
    : { uri: 'http://api.go2winbet.online' + videoSource };

  // Video caching logic
  useEffect(() => {
    if (isVideo && videoSource !== '/images/default.jpg') {
      const videoUrl = 'http://api.go2winbet.online' + videoSource;
      const fileName = videoSource.split('/').pop();
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
  }, [isVideo, videoSource]);

  // Image caching logic (fallback if no video)
  useEffect(() => {
    if (!isVideo && videoSource !== '/images/default.jpg' && !card.video) {
      const imageUrl = 'http://api.go2winbet.online' + card.image;
      const fileName = card.image?.split('/').pop();
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
  }, [isVideo, videoSource, card.image, card.video]);

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
        <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageWrapper}>
            <View style={styles.headerOverlay}>
              <CoinsHeader transparent={true} />
            </View>
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
              <Image 
              source={cachedImageUri || mediaSource} style={styles.cover} 
              resizeMode='contain' />
            ))}
            {/* <View style={styles.overlay}>
              <View style={{ flexDirection: 'row', marginLeft: 35, alignItems: 'center', gap: 6 }}>
                <Icon name="sparkle" color="#fff" />
                <Text style={{ color: '#fff' }}>{card.intensityPct}%</Text>
              </View>
            </View> */}
          </View>
          {!successModalVisible && card.description && (
            <View 
              onLayout={(event) => {
                const { y } = event.nativeEvent.layout;
                setDescriptionY(y);
              }}
            >
              <Text style={styles.desc}>{card.description}</Text>
            </View>
          )}

        </ScrollView>
        {!successModalVisible && (
          <View style={styles.bottomScreenContent}>
            <View style={styles.actionsRow}>
              <View style={{  flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}><View style={{ backgroundColor: '#FBBF24', width: 16, height: 16, borderRadius: 90 }}></View>
                <Text style={{ color: "white", fontSize: 32, fontWeight: '900' }}>{card.price}</Text>
              </View>
              <TouchableOpacity 
                style={styles.infoButton} 
                onPress={() => {
                  if (descriptionY > 0) {
                    scrollViewRef.current?.scrollTo({ y: descriptionY - 20, animated: true });
                  } else {
                    // Fallback: scroll to end if position not measured yet
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }
                }}
              >
                <Text style={styles.infoButtonTitle}>INFO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{  backgroundColor: '#00B149DE', paddingVertical: 0, paddingHorizontal: 22, borderRadius: 14 }} onPress={onBuy}>
                <Text style={{ lineHeight: 38, color: "white", textAlign: 'center', fontSize: (t('cta.buy') as string).length > 3 ? 20 : 32, fontWeight: '900', paddingVertical: 5 }}>{t('cta.buy')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
                <Text style={{ color: '#9CA3AF', fontSize: 14, fontWeight: '400', textAlign: 'center' }}>Enter your details to connect with the energy flow.</Text>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputContainer}>
                  <Icons.Name style={styles.icon} />
                  <TextInput
                    placeholder={t('common.enterYourName')}
                    placeholderTextColor="#AAA"
                    value={name}
                    onChangeText={setName}
                    style={[styles.input, { color: '#fff' }]}
                  />
                </View>

                <Text style={styles.label}>Surname</Text>

                <View style={styles.inputContainer}>
                  <Icons.Surname style={styles.icon} />

                  <TextInput
                    placeholder={t('common.enterYourSurname')}
                    placeholderTextColor="#AAA"
                    value={surname}
                    onChangeText={setSurname}
                    style={[styles.input, { color: '#fff' }]}
                  />
                </View>

                <Text style={styles.label}>{t('common.dateOfBirth')}</Text>

                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icons.Calendar style={styles.icon} />

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
                <GradientButton onClickButton={onConfirm} colors={['#00C853', '#10B981']} title='ACTIVATE' />

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
          <View style={[styles.modalBackground, { justifyContent: 'center',  }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.bottomSheet, { backgroundColor: '#000000' }]}>
                <Icons.Success style={{ alignSelf: 'center' }} />
<Text style={{ paddingTop:24,color: '#fff', fontSize: 30, fontWeight: '400', textAlign: 'center' }}>{t('common.congratulations')}</Text>
<Text style={{ color: '#9CA3AF',paddingBottom:24,paddingTop:24, fontSize: 16, fontWeight: '400', textAlign: 'center' ,paddingHorizontal:24,lineHeight:24}}>{t('common.cardPurchaseSuccess')}</Text>


           <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'center',borderColor:'#2C2C3E',borderWidth:1,borderRadius:12,padding:12,marginHorizontal:70 }}>
             {card?.image && !card.image.toLowerCase().endsWith('.mp4') && card.image !== '/images/default.jpg' && (
               <Image
                 source={{ uri: 'http://api.go2winbet.online' + card.image }}
                 style={{ width: 32, height: 40, borderRadius: 12 }}
                 resizeMode="cover"
               />
             )}
             {card?.image && card.image === '/images/default.jpg' && (
               <Image
                 source={require('../assets/images/flowImage.jpg')}
                 style={{ width: 32, height: 40, borderRadius: 12 }}
                 resizeMode="cover"
               />
             )}
             <View style={{ alignItems: 'flex-start' }}>
               <Text style={{ color: '#9CA3AF', fontSize: 14, fontWeight: '400' }}>{t('common.newCard')}</Text>
               <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 8 }}>{card?.title}</Text>
             </View>
           </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ alignItems: 'center', marginTop: -20 }}>
              <GradientButton title={t('common.awesome')} onClickButton={() => {
                setSuccessModalVisible(false);
                nav.navigate('CardsTab', { screen: 'CardsMain' });
              }} colors={['#00C853', '#10B981']} buttonStyle={{ marginHorizontal: 16 }} />
            </View>
         <Text style={{ paddingTop:16,color: '#9CA3AF', fontSize: 14, fontWeight: '400', textAlign: 'center' }}>{t('common.viewDetailsInThe')}</Text>
         <Text style={{ color: '#2979FF', fontSize: 16, fontWeight: '400', textAlign: 'center' }}>{t('common.collection')}<Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>{t('common.section')}</Text></Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#161427', flex: 1 },
  scrollContent: { paddingHorizontal: 0, paddingTop: 0, flexGrow: 1 },
  title: { color: '#fff', fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  imageWrapper: { borderRadius: 0, overflow: 'hidden', alignSelf: 'stretch', position: 'relative', width: '100%', height: Dimensions.get('window').height, marginTop: 0, top: 0 },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
    paddingTop: 0,
    marginTop: 0,
  },
  cover: { height: Dimensions.get('window').height, width: '100%', borderRadius: 0, overflow: 'hidden' },
  cardBottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomScreenContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    paddingBottom: 8,
  },
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
    paddingHorizontal:16,
  },

  bottomSheet: {
    backgroundColor: 'rgba(21, 21, 34, 0.95)',
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
  desc: { color: theme.colors.subtext, marginTop: 20, fontSize: 16, lineHeight: 24, paddingHorizontal: 16 },
  actionsRow: { justifyContent:'space-between',flexDirection: 'row', gap: 10,  paddingHorizontal: 6, alignItems: 'center', },
  infoButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  infoButtonTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
 
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  info: { color: '#E0E0E6' },
  sub: { color: theme.colors.subtext, marginTop: 8 },
  input: { flex: 1, borderColor: '#2C2C3E', borderRadius: 8, backgroundColor: '#1E1E2E' },
  label: {
    color: '#B0B0C0',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 20,
    marginBottom: 8
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#2C2C3E', borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    backgroundColor: '#1E1E2E'
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 44, 62, 1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    // height: 50,
    backgroundColor: 'rgba(30, 30, 46, 1)',
  },

  icon: {
    marginRight: 8,
  },

  // input: {
  //   flex: 1,
  //   fontSize: 16,
  //   color: '#000',
  // },
  note: { color: theme.colors.subtext, marginTop: 12 }
});