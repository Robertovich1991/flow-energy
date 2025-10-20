
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { StreamTile } from '../components/StreamTile';
import { Chip } from '../components/Chip';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { streamListSelector } from '../store/selectors/streamSelector';
import { categoriesListSelector } from '../store/selectors/categoriesSelector';
import { getCategoriesList } from '../store/slices/categoriesSlice';

export default function Streams() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const streams = useSelector(streamListSelector);
  const categories = useSelector(categoriesListSelector);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategoriesList() as any);
  }, [dispatch]);
  
  console.log(streams,'............jjjjj.................');
  console.log('Categories data:', categories);
  console.log('Selected category ID:', selectedCategoryId);
  
  // Filter streams based on selected category
  const filteredStreams = selectedCategoryId 
    ? streams?.filter((stream: any) => stream.categoryId === selectedCategoryId)
    : streams;
    
  console.log('Filtered streams:', filteredStreams);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.streams')}</Text>
      <Text style={styles.sub}>{t('sections.categories')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        <Chip 
          label={t('common.all')}
          active={selectedCategoryId === null} 
          onPress={() => setSelectedCategoryId(null)}
        />
        {categories?.map((category) => (
          <Chip 
            key={category.id} 
            label={category.name} 
            active={selectedCategoryId === category.id} 
            onPress={() => setSelectedCategoryId(category.id)}
          />
        ))}
      </View>
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
        <Text style={styles.emptyText}>{t('common.noStreamsFound')}</Text>
      )}
     
      {/**
      <TouchableOpacity style={styles.cta} onPress={() => nav.navigate('StreamAccessModal', { id:301 })}>
        <Text style={styles.ctaText}>{t('cta.getAccess')}</Text>
      </TouchableOpacity>
      **/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color:'#fff', fontSize: 32, fontWeight: '900' },
  sub: { color: theme.colors.subtext, marginTop: 12 },
  cta: { alignSelf:'flex-end', paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:'#000', marginTop:8 },
  ctaText: { color:'#fff', fontWeight:'800' },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 
  },
});
