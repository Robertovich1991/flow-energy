import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';

const COIN_PACKAGES = [
  { coins: 10, price: '$10' },
  { coins: 50, price: '$50' },
  { coins: 100, price: '$100' },
  { coins: 500, price: '$500' },
  { coins: 1000, price: '$1000' },
  { coins: 3000, price: '$3000' },
];

export default function CoinsPurchaseModal() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [userCoins] = useState(0); // Mock user balance

  const handlePurchase = (coins: number, price: string) => {
    Alert.alert(
      'Purchase Confirmation',
      `Are you sure you want to buy ${coins} coins for ${price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy', 
          onPress: () => {
            // TODO: Implement actual purchase logic
            Alert.alert('Success', `Successfully purchased ${coins} coins!`);
            nav.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <View style={styles.balanceContainer}>
          <Icon name="coin" size={20} color={theme.colors.accentLuckA} />
          <Text style={styles.balanceText}>{userCoins.toLocaleString()}</Text>
        </View>
        <Text style={styles.title}>{t('coins.title')}</Text>
        <Text style={styles.subtitle}>{t('coins.subtitle')}</Text>
      </View>

      <View style={styles.packagesContainer}>
        {COIN_PACKAGES.map((package_, index) => (
          <View key={index} style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <View style={styles.coinContainer}>
                <Icon name="coin" size={24} color={theme.colors.accentLuckA} />
                <Text style={styles.coinAmount}>{package_.coins.toLocaleString()}</Text>
              </View>
              <Text style={styles.packagePrice}>{package_.price}</Text>
            </View>
            <PrimaryButton 
              label={t('coins.buy')} 
              onPress={() => handlePurchase(package_.coins, package_.price)}
              style={styles.buyButton}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.bg, 
    padding: 16 
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 2,
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8,
  },
  balanceText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  title: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: '900', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    color: theme.colors.subtext, 
    fontSize: 16,
    textAlign: 'center',
  },
  packagesContainer: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 2,
    borderRadius: theme.radius,
    padding: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinAmount: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  packagePrice: {
    color: theme.colors.accentLuckA,
    fontSize: 18,
    fontWeight: '700',
  },
  buyButton: {
    width: '100%',
  },
});
