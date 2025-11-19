
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import { Icons } from '../assets/images/svg';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  image?: string;
  onPress?: () => void;
  style:ViewStyle
};

const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#EC7063',
    '#52BE80', '#5DADE2', '#F39C12', '#E74C3C', '#9B59B6',
    '#1ABC9C', '#3498DB', '#E67E22', '#E91E63', '#00BCD4',
    '#FF5722', '#009688', '#FFC107', '#9C27B0', '#3F51B5'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const CardTile: React.FC<Props> = ({title, price,style, intensity, image, onPress}) => {
  const { t } = useTranslation();
  
  const randomBorderColor = useMemo(() => generateRandomColor(), []);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.tile, {backgroundColor: theme.colors.card, borderColor: randomBorderColor, ...style}]}>
      {/* <View style={[styles.gradient,{backgroundColor: randomColors[0]}]} /> */}
      <Text style={styles.title}>{title}</Text>
      {price && (
        <View style={styles.priceContainer}>
          <Icons.Coins/>
          <Text style={styles.priceText}>{price}</Text>
          {/* <Icon name="coin" size={14} color={theme.colors.primary} /> */}
        </View>
      )}

      {/* {typeof intensity === 'number' && <Text style={styles.meta}>{t('fields.intensity')} {intensity}%</Text>} */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  tile: {minWidth:145, borderWidth: 1, borderRadius: 16, padding: 16, overflow: 'hidden', marginBottom: 12, width: '48%', height: 181, backgroundColor: theme.colors.card,justifyContent:'space-between',  },
  title: { color: '#fff', fontSize: 16, fontWeight: '800', fontFamily: getFontFamily('800'), marginTop: 6, marginBottom: 6,  },
  priceContainer: { marginBottom: 6, alignItems: 'center', flexDirection: 'row' },
  priceText: { color: theme.colors.primary, fontSize: 14, fontWeight: '700', fontFamily: getFontFamily('700') },
  meta: { color:'white', marginTop: 6, fontSize: 14,fontWeight:'700', fontFamily: getFontFamily('700'), textAlign: 'center' },
});
