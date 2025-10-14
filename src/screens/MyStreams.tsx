import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ownedStreamsListSelector, ownedStreamsLoadingSelector } from '../store/selectors/ownedStreamsSelector';
import { getOwnedStreamsList } from '../store/slices/ownedStreamsSlice';
import StreamCard from './StreamCard';
import { theme } from '../theme';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { transactionsListSelector } from '../store/selectors/transactionSelector';
import { getTransactionsList } from '../store/slices/transactionSlice';
dayjs.extend(utc);

export default function MyStreams() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const ownedStreams = useSelector(ownedStreamsListSelector);
  const loadingOwnedStreams = useSelector(ownedStreamsLoadingSelector);
  const transactions = useSelector(transactionsListSelector)
  console.log(transactions, '..........................transactions..........................');



  useEffect(() => {
    dispatch(getOwnedStreamsList() as any);
    dispatch(getTransactionsList() as any);
  }, [dispatch]);

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
          {ownedStreams.map((stream, index) => (
            <StreamCard 
              key={stream.id} 
              stream={stream} 
              totalDuration={(transactions as any)?.data?.[index]}
                            onPress={() => {
                // Navigate to ImageGallery with stream image (convert single image to array)
                const images = stream.image 
                  ? (stream.image === '/images/default.jpg' 
                      ? [require('../assets/images/flowImage.jpg')]
                      : [`http://api.go2winbet.online${stream.image}`])
                  : [];
                navigation.navigate('ImageGallery', {
                  images: images,
                  initialIndex: 0
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 20 },
  scrollView: { flex: 1 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  loadingText: { color: theme.colors.text, textAlign: 'center', marginTop: 20, fontSize: 16 },
  emptyText: { color: theme.colors.subtext, textAlign: 'center', marginTop: 20, fontSize: 16 },
});
