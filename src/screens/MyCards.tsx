import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../theme';
import { ownedCardsListSelector, ownedCardsLoadingSelector } from '../store/selectors/ownedCardsSelector';
import { getOwnedCardsList } from '../store/slices/ownedCardsSlice';
import BackgroundWrapper from '../components/BackgroundWrapper';

const spacing = 12;
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);
const cardHeight = Math.floor(cardWidth * 1.5);

export default function MyCards() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
 

  const ownedCards = useSelector(ownedCardsListSelector);
  const loadingOwnedCards = useSelector(ownedCardsLoadingSelector);
console.log(ownedCards,'ownedCards');

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
    <BackgroundWrapper>
      <View style={styles.container}>
      <Text style={styles.title}>{t('profile.myCards')}</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {ownedCards.map((ownedCard, index) => (
            <TouchableOpacity
              key={ownedCard.id}
              style={styles.cardContainer}
              onPress={() => nav.navigate('ImageGallery', { 
                images: ownedCard.card.image === '/images/default.jpg' 
                  ? [require('../assets/images/flowImage.jpg')]
                  : ['http://api.go2winbet.online' + ownedCard.card.image], 
                initialIndex: 0 
              })}
              activeOpacity={0.8}
            >
              <Image
                source={
                  ownedCard.card.image === '/images/default.jpg'
                    ? require('../assets/images/flowImage.jpg')
                    : { uri: 'http://api.go2winbet.online' + ownedCard.card.image }
                }
                resizeMode="cover"
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{ownedCard.card.title}</Text>
                  <Text style={styles.cardCategory}>{ownedCard.card.category.name}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>${ownedCard.card.price}</Text>
                  <Text style={styles.cardName}>👤 {ownedCard.name}</Text>
                  <Text style={styles.cardBirthday}>🎂 {ownedCard.birthday.split('T')[0]}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    height: '60%',
    backgroundColor: theme.colors.card,
  },
  cardInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flex: 1,
  },
  cardFooter: {
    marginTop: 4,
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
    marginBottom: 4,
  },
  cardName: {
    color: theme.colors.text,
    fontSize: 10,
    marginBottom: 2,
  },
  cardBirthday: {
    color: theme.colors.subtext,
    fontSize: 10,
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
