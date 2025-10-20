
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Chip } from '../components/Chip';
import { CardTile } from '../components/CardTile';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { cardListSelector } from '../store/selectors/cardSelector';
import { categoriesListSelector } from '../store/selectors/categoriesSelector';
import { getCardList } from '../store/slices/cardSlice';
import { getCategoriesList } from '../store/slices/categoriesSlice';

export default function Cards() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const cards = useSelector(cardListSelector)
  const categories = useSelector(categoriesListSelector)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getCardList() as any);
    dispatch(getCategoriesList() as any);
  }, [dispatch]);
  
  console.log('Cards data:', cards);
  console.log('Categories data:', categories);
  console.log('Selected category ID:', selectedCategoryId);
  
  // Filter cards based on selected category
  const filteredCards = selectedCategoryId 
    ? cards?.filter((card: any) => card.categoryId === selectedCategoryId)
    : cards;
    
  console.log('Filtered cards:', filteredCards);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.cards')}</Text>
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
      {/* <Text style={styles.sub}>{t('sections.subcategories')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {['Найти любовь', 'Укрепить связь', 'Возврат страсти', 'Исцеление сердца', '— все —'].map((c, i) => (
          <Chip key={i} label={c} active={i === 4} />
        ))}
      </View> */}
      <View style={styles.cardsContainer}>
        {!cards || cards.length === 0 ? (
          <Text style={styles.emptyText}>{t('common.loadingCards')}</Text>
        ) : filteredCards && filteredCards.length > 0 ? (
          filteredCards.map((card: any) => (
            <CardTile
              key={card.id}
              title={card.title}
              price={card.priceUSD || card.price}
              intensity={card.intensityPct || card.intensity}
              onPress={() => nav.navigate('CardDetail', { card: card })}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>{t('common.noCardsFound')}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900' },
  sub: { color: theme.colors.subtext, marginTop: 12 },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 
  },
});
