
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

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
  const randomColors = useMemo(() => {
    if (colors) return colors;
    const randomIndex = Math.floor(Math.random() * colorPalettes.length);
    return colorPalettes[randomIndex];
  }, [colors]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.tile, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
      <View style={[styles.gradient,{backgroundColor: randomColors[0]}]} />
      <Text style={styles.title}>{title}</Text>
      {price && <View style={styles.badge}><Text style={styles.badgeText}>{price}</Text></View>}
      {typeof intensity === 'number' && <Text style={styles.meta}>Интенсивность {intensity}%</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: { borderWidth: 2, borderRadius: 24, padding: 16, overflow: 'hidden', marginBottom: 12 },
  gradient: { position:'absolute', top:0, left:0, right:0, height:8, opacity:0.9 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 },
  badge: { position:'absolute', right: 12, top: 12, backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeText: { color:'#fff', fontWeight: '800' },
  meta: { color:'#EAEAF0', marginTop: 40, fontSize: 12 },
});
