import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
 import { PurchaseError, requestSubscription } from 'react-native-iap';
import { useSelector, useDispatch } from 'react-redux';
import { userIdSelector, coinsBalanceSelector } from '../store/selectors/authSelector';
import { purchaseCoins } from '../store/slices/coinsPurchaseSlice';
import { getCoinsBalance } from '../store/slices/authSlice';

// replaced vector coin icon with raster image asset

const COIN_PACKAGES = [
  { coins: 10, price: '$10', productId: 'coin10' },
  { coins: 50, price: '$50', productId: 'coin50' },
  { coins: 100, price: '$100', productId: 'coin100' },
  { coins: 500, price: '$500', productId: 'coin500' },
  { coins: 1000, price: '$1000', productId: 'coin1000' },
];

export default function CoinsPurchaseModal() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const coinsBalance = useSelector(coinsBalanceSelector);
  console.log(coinsBalance, 'coinsBalance');

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
        console.log(error, '//////////.......................................');

      }
    }
  }

  const handlePurchase = (coins: number, price: string) => {
    Alert.alert(
      t('common.confirmPurchase'),
      `Are you sure you want to buy ${coins} coins for ${price}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
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
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Flow up</Text>

        <View style={styles.balanceContainer}>

          <Image source={require('../assets/images/flowCoins.png')} style={{ width: 20, height: 20 }} />
          <Text style={styles.balanceText}>{coinsBalance}</Text>
        </View>
      </View> */}
      <Text style={styles.title}>{t('coins.title')}</Text>

      <View style={styles.packagesContainer}>
        {COIN_PACKAGES.map((package_, index) => (
          <View key={index} style={styles.packageCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View style={styles.packageHeader}>
              <View style={styles.coinContainer}>
                <Image source={require('../assets/images/flowcoin.png')} style={{ width: 48, height: 48 }} />
                <View >
                  <Text style={styles.coinAmount}>{package_.coins.toLocaleString()} COINS</Text>
                  <Text style={styles.packagePrice}>{package_.price}</Text>

                </View>

              </View>
            </View>
              <PrimaryButton
                label={t('coins.buy')}
                onPress={() => handleBuyProducts(package_.productId)}
                style={styles.buyButton}
              />
            </View>
          </View>

        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1625',
    padding: 16
  },
  header: {
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderColor: theme.colors.border,
    paddingVertical: 4,
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    gap: 8,
  },
  balanceText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
  title: {
    color: '#fff',
    fontSize: 30,
    paddingBottom: 30,
    letterSpacing: 1.5,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },

  packagesContainer: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius,
    padding: 16,
  },
  packageHeader: {
    //  flexDirection: 'row',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    //  marginBottom: 16,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinAmount: {
    color: 'black',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: getFontFamily('800'),
  },
  packagePrice: {
    color: theme.colors.grey,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
  },
  buyButton: {
    backgroundColor: theme.colors.green,
    alignSelf: 'center',
  },
});
