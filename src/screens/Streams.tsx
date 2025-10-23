
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { StreamTile } from '../components/StreamTile';
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
    
  // Filter categories to only show those that have streams
  const categoriesWithStreams = categories?.filter((category: any) => 
    streams?.some((stream: any) => stream.categoryId === category.id)
  );
    
  console.log('Filtered streams:', filteredStreams);
  console.log('Categories with streams:', categoriesWithStreams);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.streams')}</Text>
      <Text style={styles.sub}>{t('sections.chooseCategory')}</Text>
      <View style={styles.categoriesContainer}>
        <TouchableOpacity 
          style={[styles.categoryCard, selectedCategoryId === null && styles.categoryCardActive]}
          onPress={() => setSelectedCategoryId(null)}
        >
          <Text style={[styles.categoryText, selectedCategoryId === null && styles.categoryTextActive]}>{t('common.all')}</Text>
        </TouchableOpacity>
        {categoriesWithStreams?.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.categoryCard, selectedCategoryId === category.id && styles.categoryCardActive]}
            onPress={() => nav.navigate('CategoryStreams', { category: category })}
          >
            <Text style={[styles.categoryText, selectedCategoryId === category.id && styles.categoryTextActive]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* {!streams || streams.length === 0 ? (
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
      )} */}
     
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
  categoriesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginTop: 8,
    gap: 8
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  categoryCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  categoryText: {
    color: theme.colors.subtext,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  cta: { alignSelf:'flex-end', paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:'#000', marginTop:8 },
  ctaText: { color:'#fff', fontWeight:'800' },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 
  },
});
