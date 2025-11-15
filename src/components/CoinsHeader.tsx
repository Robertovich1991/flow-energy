import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import { Icons } from '../assets/images/svg';
import { TabNavigationContext } from '../navigation/index';

export default function CoinsHeader() {
  const nav = useNavigation<any>();
  const coinsBalance = useSelector(coinsBalanceSelector);
  const insets = useSafeAreaInsets();
  const tabNavRef = useContext(TabNavigationContext);

  const handlePress = () => {
    // Use tab navigation if available (from context)
    if (tabNavRef) {
      tabNavRef.navigate('CoinsPurchaseModal');
    } else {
      // Fallback: try direct navigation
      try {
        nav.navigate('CoinsPurchaseModal');
      } catch (error) {
        console.log('Navigation error:', error);
      }
    }
  };

  const statusBarHeight = insets.top || (Platform.OS === 'ios' ? 44 : 24);

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <Text style={{ color: 'white',fontSize:18,fontWeight:'600' }}>Flow up</Text>

      <TouchableOpacity onPress={handlePress} style={styles.coinContainer}>
        <Icons.Coins width={16} height={16} />
        <Text style={styles.coinText}>{coinsBalance.toLocaleString()}</Text>
      </TouchableOpacity>
    </View>
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
    paddingBottom: 2,
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

