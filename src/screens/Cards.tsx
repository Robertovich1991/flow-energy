
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Chip } from '../components/Chip';
import { CardTile } from '../components/CardTile';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { cardListSelector } from '../store/selectors/cardSelector';
import { categoriesListSelector } from '../store/selectors/categoriesSelector';

export default function Cards() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const cards = useSelector(cardListSelector)
  const categories = useSelector(categoriesListSelector)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Filter cards based on selected category
  const filteredCards = selectedCategoryId 
    ? cards?.filter((card: any) => card.categoryId === selectedCategoryId)
    : cards;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.cards')}</Text>
      <Text style={styles.sub}>{t('sections.categories')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        <Chip 
          label="Все"
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
      <View style={{ marginTop: 16 }}>
        {filteredCards?.map((card: any) => (
          <CardTile
            key={card.id}
            title={card.title}
            price={card.price}
            intensity={card.intensity}
            onPress={() => nav.navigate('CardDetail', { card: card })}
          />
        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900' },
  sub: { color: theme.colors.subtext, marginTop: 12 },
});
