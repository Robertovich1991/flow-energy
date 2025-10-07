import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../theme';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface StreamCardProps {
  stream: any;
  totalDuration: any; // Transaction object with created_at
  onPress?: () => void;
}

export default function StreamCard({ stream, totalDuration, onPress }: StreamCardProps) {
  const [durationInMinutes, setDurationInMinutes] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!totalDuration?.created_at) {
      console.log('No created_at found in totalDuration');
      return;
    }

    const updateDuration = () => {
      const duration = dayjs.utc(totalDuration.created_at)
        .add(1, 'hour') // add 1 hour
        .diff(dayjs.utc(), 'seconds'); // difference from now in seconds
      console.log(duration, '..........................duration..........................');
      
      const minutes = Math.round(duration / 60); // Convert to minutes and round
      
      // Calculate progress (assuming 60 minutes total)
      const progressValue = Math.max(0, Math.min(1, 1 - (duration / 3600)));
      
      setDurationInMinutes(minutes);
      setProgress(progressValue);
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: progressValue,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
    };

    // Update immediately
    updateDuration();

    // Update every minute (60000 ms)
    const interval = setInterval(updateDuration, 60000);
    
    return () => clearInterval(interval);
  }, [totalDuration, progressAnim]);
  console.log(durationInMinutes, '..........................duration in minutes..........................');

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={{ uri: 'http://api.go2winbet.online' + stream.image }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Time Remaining</Text>
          <Text style={styles.progressTime}>
            {durationInMinutes > 0 ? `${durationInMinutes} min` : 'Time Lost'}
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
