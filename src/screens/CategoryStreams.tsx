import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { StreamTile } from '../components/StreamTile';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { streamListSelector } from '../store/selectors/streamSelector';
import { getStreamList } from '../store/slices/streamSlice';

export default function CategoryStreams() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const streams = useSelector(streamListSelector);
  const category = route.params?.category;
  
  // Fetch streams on component mount
  useEffect(() => {
    dispatch(getStreamList() as any);
  }, [dispatch]);
  
  // Set navigation title
  useEffect(() => {
    nav.setOptions({ title: t('sections.streamCategories') });
  }, [nav, t]);
  
  console.log('Category:', category);
  console.log('Streams data:', streams);
  
  // Filter streams based on selected category
  const filteredStreams = streams?.filter((stream: any) => stream.categoryId === category?.id);
    
  console.log('Filtered streams for category:', filteredStreams);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category?.name || t('tabs.streams')}</Text>
      <Text style={styles.subtitle}>
        {filteredStreams?.length || 0} {filteredStreams?.length === 1 ? t('common.streamInCategory') : t('common.streamsInCategory')}
      </Text>
      
      {!streams || streams.length === 0 ? (
        <Text style={styles.emptyText}>{t('common.loadingStreams')}</Text>
      ) : filteredStreams && filteredStreams.length > 0 ? (
        filteredStreams.map((stream: any) => (
          <StreamTile
            key={stream.id}
            title={stream.title}
            price={stream.price}
            intensity={stream.intensity}
            useCases={stream.use_cases}
            onPress={() => nav.navigate('StreamDetail', { stream: stream })}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>No streams found in this category</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: theme.colors.subtext, fontSize: 16, marginBottom: 20 },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16,
    width: '100%'
  },
});
