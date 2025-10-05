import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import Icon from './Icon';

interface CoinsHeaderProps {
  coinCount: number;
}

export default function CoinsHeader({ coinCount }: CoinsHeaderProps) {
  const nav = useNavigation<any>();

  const handlePress = () => {
    nav.navigate('CoinsPurchaseModal');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.coinContainer}>
        <Icon name="coin" size={16} color={theme.colors.accentLuckA} />
        <Text style={styles.coinText}>{coinCount.toLocaleString()}</Text>
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
    backgroundColor: theme.colors.card,
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

