import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../theme';
import { ownedStreamsListSelector, ownedStreamsLoadingSelector } from '../store/selectors/ownedStreamsSelector';
import { getOwnedStreamsList } from '../store/slices/ownedStreamsSlice';

const spacing = 12;
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);
const cardHeight = Math.floor(cardWidth * 1.35);

export default function MyStreams() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const ownedStreams = useSelector(ownedStreamsListSelector);

  const loadingOwnedStreams = useSelector(ownedStreamsLoadingSelector);
  
  // Duration progress state for each stream
  const [streamProgress, setStreamProgress] = useState<{[key: number]: number}>({});
  const totalDuration = 15 * 60; // 15 minutes in seconds
  const progressAnimations = ownedStreams.reduce((acc, stream) => {
    acc[stream.id] = new Animated.Value(0);
    return acc;
  }, {} as {[key: number]: Animated.Value});

  // Fetch owned streams on component mount
  useEffect(() => {
    dispatch(getOwnedStreamsList() as any);
  }, [dispatch]);

  // Timer effect for each stream progress
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamProgress(prev => {
        const newProgress: {[key: number]: number} = {};
        ownedStreams.forEach(stream => {
          const currentProgress = prev[stream.id] || 0;
          const newTime = currentProgress + 1;
          if (newTime >= totalDuration) {
            newProgress[stream.id] = 0; // Reset when completed
          } else {
            newProgress[stream.id] = newTime;
          }
        });
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalDuration, ownedStreams]);

  // Update progress animations for each stream
  useEffect(() => {
    ownedStreams.forEach(stream => {
      const currentTime = streamProgress[stream.id] || 0;
      const progress = currentTime / totalDuration;
      Animated.timing(progressAnimations[stream.id], {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
  }, [streamProgress, totalDuration, ownedStreams]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loadingOwnedStreams) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Streams</Text>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!ownedStreams || ownedStreams.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Streams</Text>
        <Text style={styles.emptyText}>У вас нет потоков</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Streams</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {ownedStreams.map((stream, index) => {
            const currentTime = streamProgress[stream.id] || 0;
            const remainingTime = totalDuration - currentTime;
            
            return (
              <TouchableOpacity
                key={stream.id}
                style={styles.streamContainer}
                onPress={() => nav.navigate('StreamDetail', { stream: stream })}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: 'http://api.go2winbet.online' + stream.image }}
                  resizeMode="cover"
                  style={styles.streamImage}
                />
                
                {/* Individual Progress Bar */}
                <View style={styles.streamProgressContainer}>
                  <View style={styles.streamProgressInfo}>
                    <Text style={styles.streamProgressLabel}>Progress</Text>
                    <Text style={styles.streamProgressTime}>{formatTime(remainingTime)}</Text>
                  </View>
                  <View style={styles.streamProgressBar}>
                    <Animated.View 
                      style={[
                        styles.streamProgressFill, 
                        {
                          width: progressAnimations[stream.id]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }) || '0%'
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <View style={styles.streamInfo}>
                  <Text style={styles.streamTitle}>{stream.title}</Text>
                  <Text style={styles.streamCategory}>{stream.category.name}</Text>
                  <Text style={styles.streamPrice}>${stream.price}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  streamContainer: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  streamImage: {
    width: '100%',
    height: '60%',
    backgroundColor: theme.colors.card,
  },
  streamInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  streamTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  streamCategory: {
    color: theme.colors.subtext,
    fontSize: 12,
    marginBottom: 4,
  },
  streamPrice: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    color: theme.colors.subtext,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  streamProgressContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  streamProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  streamProgressLabel: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  streamProgressTime: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  streamProgressBar: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  streamProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});
