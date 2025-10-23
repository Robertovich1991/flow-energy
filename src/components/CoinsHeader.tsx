import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { theme } from '../theme';
import { coinsBalanceSelector } from '../store/selectors/authSelector';

export default function CoinsHeader() {
  const nav = useNavigation<any>();
  const coinsBalance = useSelector(coinsBalanceSelector);

  const handlePress = () => {
    nav.navigate('CoinsPurchaseModal');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.coinContainer}>
        <Image source={require('../assets/images/flowcoin.png')} style={{ width: 16, height: 16 }} />
        <Text style={styles.coinText}>{coinsBalance.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 28, 0.8)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  coinText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});

