import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface StreamCardProps {
  stream: any;
  totalDuration: any; // Transaction object with created_at
  ownedStream?: any; // Full owned stream object with coins_spent, created_at, etc.
  onPress?: () => void;
}

export default function StreamCard({ stream, totalDuration, ownedStream, onPress }: StreamCardProps) {
  const { t } = useTranslation();
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
  console.log(stream.image, '..........................duration in minutes..........................');

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={
          stream.image === '/images/default.jpg'
            ? require('../assets/images/flowImage.jpg')
            : { uri: 'http://api.go2winbet.online' + stream.image }
        }
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>{t('common.timeRemaining')}</Text>
          <Text style={styles.progressTime}>
            {durationInMinutes > 0 ? `${durationInMinutes} ${t('common.min')}` : t('common.timeLost')}
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
        {ownedStream && (
          <Text style={styles.coinsSpent}>💰 {ownedStream.coins_spent} {t('common.coins')}</Text>
        )}
        <Text style={styles.category}>{stream.category.name}</Text>
        {ownedStream && (
          <View style={styles.purchaseInfo}>
            <Text style={styles.purchaseDate}>📅 {ownedStream.created_at.split('T')[0]}</Text>
          </View>
        )}
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
    minHeight: 280,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.card,
  },
  info: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  category: {
    color: theme.colors.subtext,
    fontSize: 13,
    marginBottom: 6,
  },
  purchaseInfo: {
    marginTop: 8,
  },
  coinsSpent: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  purchaseDate: {
    color: theme.colors.subtext,
    fontSize: 11,
  },
  useCasesContainer: {
    marginTop: 8,
    marginBottom: 6,
  },
  useCase: {
    color: theme.colors.subtext,
    fontSize: 11,
    marginBottom: 3,
    lineHeight: 14,
  },
  useCaseMore: {
    color: theme.colors.primary,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
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
