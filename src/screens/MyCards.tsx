import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../theme';
import { ownedCardsListSelector, ownedCardsLoadingSelector } from '../store/selectors/ownedCardsSelector';
import { getOwnedCardsList } from '../store/slices/ownedCardsSlice';

const spacing = 12;
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);
const cardHeight = Math.floor(cardWidth * 1.35);

export default function MyCards() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
 

  const ownedCards = useSelector(ownedCardsListSelector);
  const loadingOwnedCards = useSelector(ownedCardsLoadingSelector);

  // Fetch owned cards on component mount
  useEffect(() => {
    dispatch(getOwnedCardsList() as any);
  }, [dispatch]);

  if (loadingOwnedCards) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('profile.myCards')}</Text>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!ownedCards || ownedCards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('profile.myCards')}</Text>
        <Text style={styles.emptyText}>У вас нет карт</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.myCards')}</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {ownedCards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardContainer}
              onPress={() => nav.navigate('ImageGallery', { 
                images: card.image === '/images/default.jpg' 
                  ? [require('../assets/images/flowImage.jpg')]
                  : ['http://api.go2winbet.online' + card.image], 
                initialIndex: 0 
              })}
              activeOpacity={0.8}
            >
              <Image
                source={
                  card.image === '/images/default.jpg'
                    ? require('../assets/images/flowImage.jpg')
                    : { uri: 'http://api.go2winbet.online' + card.image }
                }
                resizeMode="cover"
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardCategory}>{card.category.name}</Text>
                <Text style={styles.cardPrice}>${card.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    backgroundColor: theme.colors.card,
  },
  cardInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardCategory: {
    color: theme.colors.subtext,
    fontSize: 12,
    marginBottom: 4,
  },
  cardPrice: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    color: theme.colors.subtext,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
