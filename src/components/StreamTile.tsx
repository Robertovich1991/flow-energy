import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Icon } from './Icon';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  colors?: [string,string];
  useCases?: string[];
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

export const StreamTile: React.FC<Props> = ({title, price, intensity, colors, useCases, onPress}) => {
  const { t } = useTranslation();
  const randomColors = useMemo(() => {
    if (colors) return colors;
    const randomIndex = Math.floor(Math.random() * colorPalettes.length);
    return colorPalettes[randomIndex];
  }, [colors]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.tile, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
      <View style={[styles.gradient,{backgroundColor: randomColors[0]}]} />
      <Text style={styles.title}>{title}</Text>
      {price && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price}</Text>
          <Icon name="coin" size={16} color={theme.colors.primary} />
        </View>
      )}
      {typeof intensity === 'number' && <Text style={styles.meta}>{t('fields.intensity')} {intensity}%</Text>}
    
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: { borderWidth: 2, borderRadius: 24, padding: 20, overflow: 'hidden', marginBottom: 12, width: '100%', minHeight: 120 },
  gradient: { position:'absolute', top:0, left:0, right:0, height:8, opacity:0.9 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8, marginBottom: 8 },
  priceContainer: { marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  priceText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
  meta: { color:'#EAEAF0', marginTop: 8, fontSize: 12 },
  useCasesContainer: {
    marginTop: 8,
  },
  useCase: {
    color: theme.colors.subtext,
    fontSize: 11,
    marginBottom: 2,
  },
  useCaseMore: {
    color: theme.colors.primary,
    fontSize: 10,
    fontStyle: 'italic',
  },
});
