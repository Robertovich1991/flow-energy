import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../components/Icon';

export default function StreamDetail() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const stream = route.params?.stream;
  
  const onStartStream = () => {
    nav.navigate('StreamSession', { stream: stream });
  };

  const onGetAccess = () => {
    nav.navigate('StreamAccessModal', { streamId: stream.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{stream.title}</Text>
      <ImageBackground source={{uri: 'http://api.go2winbet.online' + stream.image}} style={styles.cover} imageStyle={styles.coverImage}>
        <View style={{padding: 16, flex: 1, justifyContent: 'space-between'}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
            <Icon name="play" color="#fff" />
            <Text style={{color:'#fff'}}>Stream</Text>
          </View>
          <Text style={styles.coverTitle}>{stream.title}</Text>
        </View>
      </ImageBackground>
      <Text style={styles.desc}>{stream.description || 'Experience this powerful stream session designed to enhance your energy and focus.'}</Text>
      <View style={styles.actionsRow}>
        <PrimaryButton leftIcon="play" rightIcon="arrow-right" label={t('cta.startStream') + ' · $' + stream.price} onPress={onStartStream} />
        <GhostButton leftIcon="lock" label={t('cta.getAccess')} onPress={onGetAccess} />
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="clock" size={16} color="#E0E0E6" />
          <Text style={styles.info}>10–15 мин</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="headphones" size={16} color="#E0E0E6" />
          <Text style={styles.info}>Наушники</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="play" size={16} color="#E0E0E6" />
          <Text style={styles.info}>Онлайн</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' },
  cover: { 
    borderColor: theme.colors.border, 
    borderWidth:2, 
    borderRadius: 24, 
    marginTop: 12, 
    height: 200, 
    justifyContent: 'space-between', 
    overflow: 'hidden'
  },
  coverImage: { 
    borderRadius: 24, 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  coverTitle: { color:'#fff', fontSize: 28, fontWeight:'900' },
  desc: { color: theme.colors.subtext, marginTop: 16 },
  actionsRow: { flexDirection:'row', gap:10, marginTop: 12 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', marginTop: 12 },
  infoItem: { flexDirection:'row', alignItems:'center', gap:6 },
  info: { color: '#E0E0E6' },
});
