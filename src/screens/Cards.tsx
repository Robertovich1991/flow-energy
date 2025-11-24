
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import { CardTile } from '../components/CardTile';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { useNavigation } from '@react-navigation/native';
import CoinsHeader from '../components/CoinsHeader';
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
  console.log(cards);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getCardList() as any);
    dispatch(getCategoriesList() as any);
  }, [dispatch]);
  
  
  // Filter cards based on selected category
  const filteredCards = useMemo(() => {
    return selectedCategoryId 
      ? cards?.filter((card: any) => card.categoryId === selectedCategoryId) || []
      : cards || [];
  }, [cards, selectedCategoryId]);
    
  // Filter categories to only show those that have cards
  const categoriesWithCards = categories?.filter((category: any) => 
    cards?.some((card: any) => card.categoryId === category.id)
  );

  const renderCard = ({ item, index }: { item: any; index: number }) => {
    // Render 2 cards per row
    const leftCard: any = item;
    const rightCard: any = filteredCards[index * 2 + 1];
    
    return (
      <View style={styles.cardRow}>
        <CardTile
          key={leftCard.id}
          title={leftCard.title}
          image={leftCard.image}
          price={leftCard.priceUSD || leftCard.price}
          intensity={leftCard.intensityPct || leftCard.intensity}
          style={{}}
          onPress={() => nav.navigate('CardDetail', { card: leftCard })}
        />
        {rightCard && (
          <CardTile
            key={rightCard.id}
            title={rightCard.title}
            image={rightCard.image}
            price={rightCard.priceUSD || rightCard.price}
            intensity={rightCard.intensityPct || rightCard.intensity}
            style={{}}
            onPress={() => nav.navigate('CardDetail', { card: rightCard })}
          />
        )}
      </View>
    );
  };

  const cardPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < filteredCards.length; i += 2) {
      pairs.push(filteredCards[i]);
    }
    return pairs;
  }, [filteredCards]);

  return (
    <BackgroundWrapper>
      <CoinsHeader showArrow={false} />
      <View style={styles.container}>
        <Text style={styles.title}>{t('tabs.cards')}</Text>
        {!cards || cards.length === 0 ? (
          <Text style={styles.emptyText}>{t('common.loadingCards')}</Text>
        ) : filteredCards.length > 0 ? (
          <FlatList
            data={cardPairs}
            renderItem={renderCard}
            keyExtractor={(item, index) => `card-pair-${item.id}-${index}`}
            numColumns={1}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={6}
            windowSize={10}
            getItemLayout={(data, index) => ({
              length: 233, // card height (221) + marginBottom (12)
              offset: 233 * index,
              index,
            })}
          />
        ) : (
          <Text style={styles.emptyText}>{t('common.noCardsFound')}</Text>
        )}
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  title: { color: '#fff', fontSize: 40, fontWeight: '700', fontFamily: getFontFamily('700'), paddingBottom:20 },
  listContent: { paddingBottom: 20 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sub: { color: theme.colors.subtext, marginTop: 12, fontFamily: getFontFamily('400') },
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
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 0,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    overflow: 'hidden',
  },
  categoryBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  categoryImageStyle: {
    borderRadius: 16,
    opacity: 0.8,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  categoryCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  categoryText: {
    color: theme.colors.subtext,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textAlign: 'center',
  },
  categoryTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16,
    fontFamily: getFontFamily('400')
  },
});
