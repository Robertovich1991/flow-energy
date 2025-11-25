
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import BackgroundWrapper from '../components/BackgroundWrapper';

export default function StreamSession() {
  const { t } = useTranslation();
  const [sec, setSec] = useState(10*60); // demo 10 minutes
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const stream = route.params?.stream;

  useEffect(() => {
    const t = setInterval(()=> setSec(s => s>0? s-1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (sec === 0) { } }, [sec]);

  const mm = String(Math.floor(sec/60)).padStart(2,'0');
  const ss = String(sec%60).padStart(2,'0');

  // Calculate progress percentage (assuming 10 minutes total)
  const totalSeconds = 10 * 60;
  const progress = ((totalSeconds - sec) / totalSeconds) * 100;

  const CircularProgress = ({ progress, size = 200, strokeWidth = 10 }: { progress: number, size?: number, strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0A3941"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#34D399"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{mm}:{ss}</Text>
        </View>
      </View>
    );
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <Text style={styles.title}>{stream?.title || 'Stream Session'}</Text>
      <View style={styles.card}>
        <CircularProgress progress={progress} size={200} strokeWidth={10} />
      </View>
      <GradientButton 
        title="EXTEND FLOW" 
        onClickButton={() => {}}
        colors={['rgba(0, 198, 255, 1)', 'rgba(0, 114, 255, 1)']}
        buttonStyle={styles.extendButton}
      />
      <GhostButton label={t('common.complete')} onPress={()=>nav.goBack()} />
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: 'transparent', padding:16 },
  title: { color:'#fff', fontSize: 28, fontWeight:'900' },
  card: { borderColor: theme.colors.border, borderWidth:2, borderRadius:24, padding: 20, marginTop: 12, alignItems:'center', justifyContent:'center', height: 320 },
  timer: { color:'#fff', fontSize: 64, fontWeight:'900' },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#0A3941',
    borderRadius: 120,
    padding: 8,
  },
  timerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  extendButton: {
    marginTop: 24,
    marginBottom: 16,
  },
});
