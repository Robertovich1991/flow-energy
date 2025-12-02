import React, { useMemo, useRef, useCallback, useState } from 'react';
import { View, FlatList, Image, Dimensions, StatusBar, TouchableWithoutFeedback, Animated, TouchableOpacity, Alert, Platform, Share, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import Icon from '../components/Icon';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme, getFontFamily } from '../theme';
import { Icons } from '../assets/images/svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GalleryRouteParams = {
  ImageGallery: {
    images: (string | number)[]; // Support both URI strings and local image numbers
    initialIndex?: number;
    cardTitle?: string;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);
console.log(cardTitle,'[[[[[[[[[');

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

  const downloadImage = async () => {
    if (isDownloading) return;
    
    const currentImage = images[currentImageIndex];
    if (!currentImage) return;

    // Check if it's a local image (number) - can't share local images
    if (typeof currentImage === 'number') {
      Alert.alert(
        'Local Image',
        'This is a local image and cannot be shared directly.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsDownloading(true);
    
    try {
      // Use React Native's Share API to save the image
      const result = await Share.share({
        url: currentImage,
        message: Platform.OS === 'ios' 
          ? 'Save this image to your Photos app' 
          : 'Save this image to your device'
      });

      if (result.action === Share.sharedAction) {
        Alert.alert(
          'Image Shared',
          Platform.OS === 'ios' 
            ? 'You can save the image to your Photos app from the share menu.'
            : 'You can save the image to your device from the share menu.',
          [{ text: 'OK' }]
        );
      } else if (result.action === Share.dismissedAction) {
        // User dismissed the share dialog
        console.log('Share dialog dismissed');
      }
      
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert(
        'Error',
        'Unable to share the image. Please try again.',
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
        
        {cardTitle && (
          <Text style={styles.cardTitle} numberOfLines={1}>
            {cardTitle}
          </Text>
        )}
        
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
  cardTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textAlign: 'center',
    marginHorizontal: 16,
  },
  downloadButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
});
