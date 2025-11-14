import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { theme } from '../theme';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import { Icons } from '../assets/images/svg';

export default function CoinsHeader() {
  const nav = useNavigation<any>();
  const coinsBalance = useSelector(coinsBalanceSelector);

  const handlePress = () => {
    nav.navigate('CoinsPurchaseModal');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={{ color: 'white' }}>Flow up</Text>

      <View style={styles.coinContainer}>
        <Icons.Coins width={16} height={16} />
        <Text style={styles.coinText}>{coinsBalance.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row' ,
    width:Dimensions.get('window').width ,
    backgroundColor:'#161427',
    paddingHorizontal:16,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#2A263E',
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

