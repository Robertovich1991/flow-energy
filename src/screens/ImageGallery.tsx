import React, { useMemo, useRef, useCallback } from 'react';
import { View, FlatList, Image, Dimensions, StatusBar, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
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

  const renderItem = useCallback(({ item }: { item: string }) => (
    <GalleryPage uri={item} width={width} height={height} />
  ), [width, height]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" hidden />
      <TouchableOpacity
        onPress={() => {/* TODO: implement download */}}
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 }}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Download image"
      >
        <Icon name="download" size={22} color="#fff" />
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


