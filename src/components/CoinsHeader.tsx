import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, getFontFamily } from '../theme';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import { Icons } from '../assets/images/svg';
import { TabNavigationContext } from '../navigation/index';

type CoinsHeaderProps = {
  showArrow?: boolean;
};

export default function CoinsHeader({ showArrow = true }: CoinsHeaderProps) {
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

  const handleBackPress = () => {
    if (nav.canGoBack()) {
      nav.goBack();
    }
  };

  const statusBarHeight = insets.top || (Platform.OS === 'ios' ? 44 : 24);

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight - 15 }]}>
      <View style={styles.leftSection}>
        {showArrow && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icons.Arrow width={24} height={24} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerText, { color: 'white', fontSize: 18, fontWeight: '600' }]}>Flow up</Text>
      </View>

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
    marginBottom: 5,
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontFamily: getFontFamily('600'),
  },
  coinText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
});

