import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
 import { PurchaseError, requestSubscription } from 'react-native-iap';
import { useSelector, useDispatch } from 'react-redux';
import { userIdSelector, coinsBalanceSelector } from '../store/selectors/authSelector';
import { purchaseCoins } from '../store/slices/coinsPurchaseSlice';
import { getCoinsBalance } from '../store/slices/authSlice';

// replaced vector coin icon with raster image asset

const COIN_PACKAGES = [
  { coins: 10, price: '$10' ,productId: 'coin10'},
  { coins: 50, price: '$50' ,productId: 'coin50'},
  { coins: 100, price: '$100' ,productId: 'coin100'},
  { coins: 500, price: '$500' ,productId: 'coin500'},
  { coins: 1000, price: '$1000' ,productId: 'coin1000'},
];

export default function CoinsPurchaseModal() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const coinsBalance = useSelector(coinsBalanceSelector);
console.log(coinsBalance,'coinsBalance');

  // Set navigation title
  useEffect(() => {
    nav.setOptions({ title: t('headers.buyCoins') });
  }, [nav, t]);

  const handleBuyProducts = async (productId: string) => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    console.log(productId, '>>>>>><<<<<<<<<<<<<<<<<99999999999999999');
  
    try {
      const skus = await requestSubscription({
        sku: productId,
      });
  
      console.log(skus, '------000000000099999iiiiiiii----');
      
      // Find the coin package details for AppsFlyer logging
      const coinPackage = COIN_PACKAGES.find(pkg => pkg.productId === productId);
      
      // Handle the skus response (it can be an array or single object)
      const skuData = Array.isArray(skus) ? skus[0] : skus;
      
      if (!skuData) {
        throw new Error('Purchase data not received');
      }
      
      // Send purchase data to backend
      const purchaseData = {
        app_store_product_id: skuData.productId,
        app_store_transaction_id: skuData.transactionReceipt,
        user_id: userId
      };

      // Dispatch the purchase action with coin details for AppsFlyer logging
      await dispatch(purchaseCoins(purchaseData, coinPackage?.coins, coinPackage ? parseInt(coinPackage.price.replace('$', '')) : undefined) as any);
      
      // Refresh coins balance after successful purchase
      dispatch(getCoinsBalance() as any);
      
      Alert.alert('Success', 'Coins purchased successfully!');
      nav.goBack();
  
    } catch (error) {
      if (error instanceof PurchaseError) {
       // console.log({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        Alert.alert(
          'Purchase error',
          'Try again later',
          [{ text: 'OK' }],
        );
        console.log(error,'//////////.......................................');
        
      }
    }
  }

  const handlePurchase = (coins: number, price: string) => {
    Alert.alert(
      t('common.confirmPurchase'),
      `Are you sure you want to buy ${coins} coins for ${price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: t('common.buyCoins'), 
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
          <Image source={require('../assets/images/flowcoin.png')} style={{ width: 20, height: 20 }} />
          <Text style={styles.balanceText}>{coinsBalance}</Text>
        </View>
        <Text style={styles.title}>{t('coins.title')}</Text>
        <Text style={styles.subtitle}>{t('coins.subtitle')}</Text>
      </View>

      <View style={styles.packagesContainer}>
        {COIN_PACKAGES.map((package_, index) => (
          <View key={index} style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <View style={styles.coinContainer}>
                <Image source={require('../assets/images/flowcoin.png')} style={{ width: 24, height: 24 }} />
                <Text style={styles.coinAmount}>{package_.coins.toLocaleString()}</Text>
              </View>
              <Text style={styles.packagePrice}>{package_.price}</Text>
            </View>
            <PrimaryButton 
              label={t('coins.buy')} 
              onPress={() => handleBuyProducts(package_.productId)}
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
