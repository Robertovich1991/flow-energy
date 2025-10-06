import React, { useMemo, useRef, useCallback, useState } from 'react';
import { View, FlatList, Image, Dimensions, StatusBar, TouchableWithoutFeedback, Animated, TouchableOpacity, Alert, Platform, Share } from 'react-native';
import Icon from '../components/Icon';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

type GalleryRouteParams = {
  ImageGallery: {
    images: string[];
    initialIndex?: number;
  };
};

export default function ImageGallery() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const listRef = useRef<FlatList<string>>(null);
  const { width, height } = Dimensions.get('window');
  const images = useMemo(() => route.params?.images ?? [], [route.params]);
  const initialIndex = route.params?.initialIndex ?? 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);

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
    
    const currentImageUrl = images[currentImageIndex];
    if (!currentImageUrl) return;

    setIsDownloading(true);
    
    try {
      // Use React Native's Share API to save the image
      const result = await Share.share({
        url: currentImageUrl,
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

  const renderItem = useCallback(({ item }: { item: string }) => (
    <GalleryPage uri={item} width={width} height={height} />
  ), [width, height]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" hidden />
      <TouchableOpacity
        onPress={downloadImage}
        disabled={isDownloading}
        style={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 10, 
          backgroundColor: isDownloading ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)', 
          padding: 10, 
          borderRadius: 20 
        }}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        accessibilityRole="button"
        accessibilityLabel={isDownloading ? "Sharing..." : "Share/Save image"}
      >
        <Icon name="download" size={22} color={isDownloading ? "#ccc" : "#fff"} />
      </TouchableOpacity>
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

function GalleryPage({ uri, width, height }: { uri: string; width: number; height: number }) {
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

  return (
    <View style={{ width, height, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <Animated.View style={{ width, height, transform: [{ scale }] }}>
          <Image
            source={{ uri }}
            resizeMode="contain"
            style={{ width, height }}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}


