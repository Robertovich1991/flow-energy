import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { CardTile } from '../components/CardTile';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { cardListSelector } from '../store/selectors/cardSelector';
import { getCardList } from '../store/slices/cardSlice';

export default function CategoryCards() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const cards = useSelector(cardListSelector);
  const category = route.params?.category;
  
  // Fetch cards on component mount
  useEffect(() => {
    dispatch(getCardList() as any);
  }, [dispatch]);
  
  // Set navigation title
  useEffect(() => {
    nav.setOptions({ title: t('sections.cardCategories') });
  }, [nav, t]);
  
  console.log('Category:', category);
  console.log('Cards data:', cards);
  
  // Filter cards based on selected category
  const filteredCards = cards?.filter((card: any) => card.categoryId === category?.id);
    
  console.log('Filtered cards for category:', filteredCards);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category?.name || t('tabs.cards')}</Text>
      <Text style={styles.subtitle}>
        {filteredCards?.length || 0} {filteredCards?.length === 1 ? t('common.cardInCategory') : t('common.cardsInCategory')}
      </Text>
      
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
          <Text style={styles.emptyText}>No cards found in this category</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: theme.colors.subtext, fontSize: 16, marginBottom: 20 },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16,
    width: '100%'
  },
});
