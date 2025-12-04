import React, { useMemo, useRef, useCallback, useState } from 'react';
import { View, FlatList, Image, Dimensions, StatusBar, TouchableWithoutFeedback, Animated, TouchableOpacity, Alert, Platform, Share, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import Video from 'react-native-video';
import Icon from '../components/Icon';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme, getFontFamily } from '../theme';
import { Icons } from '../assets/images/svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { applyOverlay } from 'react-native-video-overlay';

type GalleryRouteParams = {
  ImageGallery: {
    images: (string | number)[]; // Support both URI strings and local image numbers
    initialIndex?: number;
    cardTitle?: string;
    cardName?: string;
    cardSurname?: string;
    cardBirthday?: string; // Format: "2022-10-15T00:00:00.000000Z" or "YYYY-MM-DD"
  };
};

export default function ImageGallery() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<string | number>>(null);
  const { width, height } = Dimensions.get('window');
  const images = useMemo(() => route.params?.images ?? [], [route.params]);
  const initialIndex = route.params?.initialIndex ?? 0;
  const cardTitle = route.params?.cardTitle;
  const cardName = route.params?.cardName;
  const cardSurname = route.params?.cardSurname;
  const cardBirthday = route.params?.cardBirthday;
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);

  // Format birthday from "YYYY-MM-DD" or ISO string to "dd/mm/yyyy"
  const formatBirthday = (birthday?: string): string => {
    if (!birthday) return '';
    try {
      // Handle ISO format like "2022-10-15T00:00:00.000000Z"
      const dateStr = birthday.split('T')[0]; // Get "YYYY-MM-DD" part
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting birthday:', error);
      return '';
    }
  };

  const formattedBirthday = formatBirthday(cardBirthday);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('gestureEnd', () => {
      StatusBar.setBarStyle('light-content');
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
    }, 0);
  }, [initialIndex]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to save media to your gallery',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    // iOS permissions are requested automatically when saving
    // They are configured in Info.plist
    return true;
  };

  const downloadImage = async () => {
    if (isDownloading) return;
    
    const currentImage = images[currentImageIndex];
    if (!currentImage) return;

    // Check if it's a local image (number) - can't download local images
    if (typeof currentImage === 'number') {
      Alert.alert(
        'Local Media',
        'This is a local file and cannot be downloaded.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsDownloading(true);
    
    try {
      const mediaUrl = typeof currentImage === 'string' ? currentImage : String(currentImage);
      const isVideo = mediaUrl.toLowerCase().endsWith('.mp4');
      
      // Construct full URL if it's a relative path
      const fullUrl = mediaUrl.startsWith('http') 
        ? mediaUrl 
        : `http://api.go2winbet.online${mediaUrl}`;
      
      // Get file name from URL
      let fileName = mediaUrl.split('/').pop() || (isVideo ? 'video.mp4' : 'image.jpg');
      
      // If it's a video and we have name/birthday, include it in the filename
      if (isVideo && (cardName || formattedBirthday)) {
        // Build filename from name and birthday
        const namePart = cardName ? cardName.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_').substring(0, 30) : '';
        const birthdayPart = formattedBirthday ? formattedBirthday.replace(/\//g, '_') : '';
        const filenameParts = [namePart, birthdayPart].filter(Boolean);
        const sanitizedInfo = filenameParts.join('_') || 'video';
        const fileExtension = fileName.split('.').pop() || 'mp4';
        fileName = `${sanitizedInfo}_${Date.now()}.${fileExtension}`;
      }
      
      // Request permissions for Android
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to save media to your gallery.',
          [{ text: 'OK' }]
        );
        setIsDownloading(false);
        return;
      }
      
      // Determine save path for temporary download
      const downloadPath = Platform.OS === 'ios'
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;
      
      // Download the file first
      const downloadResult = await RNFS.downloadFile({
        fromUrl: fullUrl,
        toFile: downloadPath,
        background: true,
        discretionary: true,
      }).promise;
      
      if (downloadResult.statusCode === 200) {
        // Verify file exists before saving
        const fileExists = await RNFS.exists(downloadPath);
        if (!fileExists) {
          throw new Error('Downloaded file not found');
        }

        let finalVideoPath = downloadPath;

        // If it's a video and we have name/birthday, add text overlay
        if (isVideo && (cardName || formattedBirthday)) {
          try {
            const outputFileName = `video_with_info_${Date.now()}.mp4`;
            const outputPath = Platform.OS === 'ios'
              ? `${RNFS.DocumentDirectoryPath}/${outputFileName}`
              : `${RNFS.DownloadDirectoryPath}/${outputFileName}`;

            // Build overlay text: name and birthday
            const overlayText = [cardName, formattedBirthday].filter(Boolean).join(' • ');

            // react-native-video-overlay is Android-only, so for iOS we'll save with info in filename
            if (Platform.OS === 'android') {
              console.log('Adding text overlay to video...');
              
              // Use applyOverlay to add text watermark to video
              const processedPath = await applyOverlay({
                inputPath: downloadPath,
                outputPath: outputPath,
                overlays: [
                  {
                    type: 'text',
                    text: overlayText,
                    position: 'bottom-center',
                    fontSize: 28,
                    fontColor: 'white',
                    opacity: 1.0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
                  },
                ],
                onProgress: (logLine: string) => {
                  console.log('[FFmpeg]', logLine);
                },
              });

              if (processedPath) {
                finalVideoPath = processedPath;
                // Clean up original video
                RNFS.unlink(downloadPath).catch(err => console.log('Cleanup error:', err));
                console.log('Video processed successfully with text overlay');
              } else {
                console.warn('Video processing returned no path, using original');
              }
            } else {
              // For iOS, include name/birthday in filename since react-native-video-overlay is Android-only
              console.log('iOS: Name and birthday will be included in filename');
            }
          } catch (processingError) {
            console.error('Video processing error:', processingError);
            // Continue with original video if processing fails
            finalVideoPath = downloadPath;
          }
        }

        // Save to gallery using CameraRoll
        try {
          // Use the path without file:// prefix for CameraRoll
          const fileUri = Platform.OS === 'ios' 
            ? finalVideoPath // iOS doesn't need file:// prefix
            : `file://${finalVideoPath}`; // Android needs file:// prefix
          
          const saveOptions = isVideo 
            ? { type: 'video' as const, album: 'Flow Up' }
            : { type: 'photo' as const, album: 'Flow Up' };
          
          const savedUri = await CameraRoll.save(fileUri, saveOptions);
          console.log('Saved to gallery:', savedUri);
          
          Alert.alert(
            'Success',
            isVideo 
              ? 'Video has been saved to your gallery!'
              : 'Image has been saved to your gallery!',
            [{ text: 'OK' }]
          );
          
          // Clean up temporary file after saving to gallery
          RNFS.unlink(finalVideoPath).catch(err => console.log('Cleanup error:', err));
        } catch (saveError: any) {
          console.error('Save to gallery error:', saveError);
          // Fallback to Share API if CameraRoll fails
          try {
            const result = await Share.share({
              url: Platform.OS === 'ios' 
                ? `file://${downloadPath}`
                : `file://${downloadPath}`,
              message: Platform.OS === 'ios' 
                ? `Save this ${isVideo ? 'video' : 'image'} to your Photos app` 
                : `Save this ${isVideo ? 'video' : 'image'} to your device`
            });

            if (result.action === Share.sharedAction) {
              Alert.alert(
                'Downloaded',
                `You can save the ${isVideo ? 'video' : 'image'} to your gallery from the share menu.`,
                [{ text: 'OK' }]
              );
            }
          } catch (shareError) {
            Alert.alert(
              'Error',
              saveError?.message || 'Unable to save to gallery. Please try again.',
              [{ text: 'OK' }]
            );
          }
        }
      } else {
        throw new Error(`Download failed with status code: ${downloadResult.statusCode}`);
      }
      
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Error',
        error?.message || 'Unable to download the media. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: string | number }) => (
    <GalleryPage source={item} width={width} height={height} />
  ), [width, height]);

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" hidden />
      
      {/* Header with title and close button */}
      <View style={[styles.header, { paddingTop: 10 }]}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Icons.Arrow width={32} height={32} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          {cardTitle && (
            <Text style={styles.cardTitle} numberOfLines={1}>
              {cardTitle}
            </Text>
          )}
          {(cardName || cardSurname || formattedBirthday) && (
            <View style={styles.cardInfoContainer}>
              <Text style={styles.cardInfo} numberOfLines={1}>
                {[cardName, cardSurname].filter(Boolean).join(' ')}
                {formattedBirthday && ` • ${formattedBirthday}`}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          onPress={downloadImage}
          disabled={isDownloading}
          style={styles.downloadButton}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityRole="button"
          accessibilityLabel={isDownloading ? "Sharing..." : "Share/Save image"}
        >
          <Icon name="download" size={22} color={isDownloading ? "#ccc" : "#fff"} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(uri, idx) => `${uri}-${idx}`}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialNumToRender={3}
        windowSize={5}
        maxToRenderPerBatch={3}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
}

function GalleryPage({ source, width, height }: { source: string | number; width: number; height: number }) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const lastTap = React.useRef<number>(0);

  const onDoubleTap = () => {
    scale.stopAnimation((currentValue?: number) => {
      const next = currentValue && currentValue > 1 ? 1 : 2;
      Animated.spring(scale, {
        toValue: next,
        useNativeDriver: true,
        friction: 8,
        tension: 80,
      }).start();
    });
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onDoubleTap();
    }
    lastTap.current = now;
  };

  // Check if source is a video
  const isVideo = typeof source === 'string' && source.toLowerCase().endsWith('.mp4');
  
  // Determine image source type
  const imageSource = typeof source === 'number' ? source : { uri: source };
  const videoSource = typeof source === 'string' ? { uri: source } : require('../assets/images/flowImage.jpg');

  return (
    <View style={{ width, height, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      {isVideo ? (
        <Video
          source={videoSource}
          style={{ width, height }}
          resizeMode="contain"
          repeat={true}
          muted={false}
          playInBackground={false}
          playWhenInactive={false}
          controls={true}
        />
      ) : (
        <TouchableWithoutFeedback onPress={handleTap}>
          <Animated.View style={{ width, height, transform: [{ scale }] }}>
            <Image
              source={imageSource}
              resizeMode="contain"
              style={{ width, height }}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textAlign: 'center',
  },
  cardInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cardInfo: {
    color: '#B0B0C0',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
});
