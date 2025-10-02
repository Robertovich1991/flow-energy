
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

type Props = { label: string; active?: boolean; onPress?: () => void; style?: ViewStyle; };

export const Chip: React.FC<Props> = ({label, active, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.base, active ? styles.active : styles.inactive, style]}>
    <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginRight: 8, marginBottom: 8 },
  active: { backgroundColor: theme.colors.primary },
  inactive: { borderWidth: 2, borderColor: theme.colors.border },
  text: { fontWeight: '800' },
  textActive: { color: '#000' },
  textInactive: { color: theme.colors.text },
});
