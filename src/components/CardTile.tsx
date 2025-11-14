
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Icons } from '../assets/images/svg';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  colors?: [string,string];
  onPress?: () => void;
};

const colorPalettes = [
  ['#F472B6', '#DB2777'], // Pink
  ['#34D399', '#16A34A'], // Green
  ['#FCD34D', '#CA8A04'], // Yellow
  ['#38BDF8', '#2563EB'], // Blue
  ['#A78BFA', '#7C3AED'], // Purple
  ['#FB7185', '#E11D48'], // Rose
  ['#10B981', '#059669'], // Emerald
  ['#F59E0B', '#D97706'], // Amber
  ['#06B6D4', '#0891B2'], // Cyan
  ['#8B5CF6', '#7C2D12'], // Violet
];

export const CardTile: React.FC<Props> = ({title, price, intensity, colors, onPress}) => {
  const { t } = useTranslation();
  const randomColors = useMemo(() => {
    if (colors) return colors;
    const randomIndex = Math.floor(Math.random() * colorPalettes.length);
    return colorPalettes[randomIndex];
  }, [colors]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.tile, {backgroundColor: theme.colors.card, borderColor: randomColors[1]}]}>
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
  tile: { borderWidth: 1, borderRadius: 16, padding: 16, overflow: 'hidden', marginBottom: 12, width: '48%', height: 181, backgroundColor: theme.colors.card,justifyContent:'space-between',  },
  title: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 6, marginBottom: 6,  },
  priceContainer: { marginBottom: 6, alignItems: 'center', flexDirection: 'row' },
  priceText: { color: theme.colors.primary, fontSize: 14, fontWeight: '700' },
  meta: { color:'#EAEAF0', marginTop: 6, fontSize: 10, textAlign: 'center' },
});
