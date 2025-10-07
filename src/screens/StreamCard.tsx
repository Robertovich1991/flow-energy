import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../theme';
import dayjs from 'dayjs';

interface StreamCardProps {
  stream: any;
  totalDuration: number;
  onPress?: () => void;
}

export default function StreamCard({ stream, totalDuration, onPress }: StreamCardProps) {
  const [progressTime, setProgressTime] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const progress = Math.min(1, progressTime / totalDuration);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progressTime, totalDuration]);

  const remainingTime = totalDuration - progressTime;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={{ uri: 'http://api.go2winbet.online' + stream.image }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressTime}>
            {remainingTime > 0 ? formatTime(remainingTime) : 'time lost'}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{stream.title}</Text>
        <Text style={styles.category}>{stream.category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.card,
  },
  info: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  category: {
    color: theme.colors.subtext,
    fontSize: 12,
  },
  progressContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  progressTime: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});
