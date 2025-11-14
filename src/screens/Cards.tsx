
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { CardTile } from '../components/CardTile';
import BackgroundWrapper from '../components/BackgroundWrapper';
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
  
  
  // Filter cards based on selected category
  const filteredCards = selectedCategoryId 
    ? cards?.filter((card: any) => card.categoryId === selectedCategoryId)
    : cards;
    
  // Filter categories to only show those that have cards
  const categoriesWithCards = categories?.filter((category: any) => 
    cards?.some((card: any) => card.categoryId === category.id)
  );
    

  return (
    <BackgroundWrapper>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.cards')}</Text>
      {/* <Text style={styles.sub}>{t('sections.chooseCategory')}</Text> */}
      {/* <View style={styles.categoriesContainer}>
        <TouchableOpacity 
          style={[styles.categoryCard, selectedCategoryId === null && styles.categoryCardActive]}
          onPress={() => setSelectedCategoryId(null)}
        >
          <Text style={[styles.categoryText, selectedCategoryId === null && styles.categoryTextActive]}>{t('common.all')}</Text>
        </TouchableOpacity>
        {categoriesWithCards?.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.categoryCard, selectedCategoryId === category.id && styles.categoryCardActive]}
            onPress={() => nav.navigate('CategoryCards', { category: category })}
          >
            <Text style={[styles.categoryText, selectedCategoryId === category.id && styles.categoryTextActive]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View> */}
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
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  title: { color: '#fff', fontSize: 40,paddingTop:71, fontWeight: '700' },
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
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  emptyText: { 
    color: theme.colors.subtext, 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 
  },
});
