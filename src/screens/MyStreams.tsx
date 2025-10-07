import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
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
  const ownedStreams = useSelector(ownedStreamsListSelector);
  const loadingOwnedStreams = useSelector(ownedStreamsLoadingSelector);
  const transactions = useSelector(transactionsListSelector)

  const dateNow = dayjs.utc().subtract(2, 'hour');
  const created = dayjs.utc(transactions.data.created_at)
  const difference = dateNow.diff(created, 'minute');
  const getTotalDurationForStream = (streamId: number) => {
    const tx = transactions.data.find(t => t.metadata.stream_id === streamId);
    if (!tx) return 0;
    const created = dayjs.utc(tx.created_at).subtract(-2, 'hour');
    const difference = dayjs.utc().diff(created, 'minute');
    return difference * 60;
  };


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
          {ownedStreams.map(stream => (
            <StreamCard key={stream.id} stream={stream} totalDuration={getTotalDurationForStream(stream.id)} />
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
