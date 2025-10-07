
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function StreamSession() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stream?.title || 'Stream Session'}</Text>
      {/* <View style={styles.card}>
        <Text style={styles.timer}>{mm}:{ss}</Text>
      </View> */}
      <PrimaryButton label="Продлить" onPress={()=>{}} style={{marginVertical:8}} />
      <GhostButton label="Завершить" onPress={()=>nav.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding:16 },
  title: { color:'#fff', fontSize: 28, fontWeight:'900' },
  card: { borderColor: theme.colors.border, borderWidth:2, borderRadius:24, padding: 20, marginTop: 12, alignItems:'center', justifyContent:'center', height: 320 },
  timer: { color:'#fff', fontSize: 64, fontWeight:'900' },
});
