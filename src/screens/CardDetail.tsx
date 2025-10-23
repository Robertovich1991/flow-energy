
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, ImageBackground } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../store/app';
import { useSelector } from 'react-redux';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import Icon from '../components/Icon';
import BackgroundWrapper from '../components/BackgroundWrapper';

export default function CardDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const card = route.params?.card
  const coinsBalance = useSelector(coinsBalanceSelector);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [cachedVideoUri, setCachedVideoUri] = useState(null);
  const [cachedImageUri, setCachedImageUri] = useState(null);
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
  
  // Set navigation title with coins balance and background
  useEffect(() => {
    nav.setOptions({ 
      title: t('headers.card'),
      headerBackground: () => (
        <ImageBackground 
          source={require('../assets/images/flowground.png')} 
          style={{ flex: 1 }}
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

  return (
    <BackgroundWrapper>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>{card.title}</Text>
      <View style={styles.imageWrapper}>
        {isVideo ? (
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
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' },
  imageWrapper: { marginTop: 12, borderRadius: 20, overflow: 'hidden', alignSelf: 'center' },
  cover: { height: 440, width: 400, borderRadius: 20 },
  overlay: { position: 'absolute', top: 16, left: 16, right: 16, flex: 1, justifyContent: 'space-between' },
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
  actionsRow: { flexDirection:'row', gap:10, marginTop: 12 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', marginTop: 12 },
  infoItem: { flexDirection:'row', alignItems:'center', gap:6 },
  info: { color: '#E0E0E6' },
});
