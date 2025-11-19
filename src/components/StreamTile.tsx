import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Icon } from './Icon';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  colors?: [string, string];
  useCases?: string[];
  onPress?: () => void;
};


export const StreamTile: React.FC<Props> = ({ title, price, intensity, colors, useCases, onPress }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.tile, { backgroundColor: '#ffff' }]}>
      {/* <View style={[styles.gradient,{backgroundColor: randomColors[0]}]} /> */}
      <View style={{backgroundColor:'#5ac0d7ff',width:50,height:50,borderRadius:100}}></View>
      <View style={{ flex: 1, marginLeft: 22 }}>
        <Text style={styles.title}>{title}</Text>
        {price && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{price}</Text>
            <Icon name="coin" size={16} color={'black'} />
          </View>
        )}
        {typeof intensity === 'number' && <Text style={styles.meta}>{t('fields.intensity')} {intensity}%</Text>}
      </View>
      <TouchableOpacity style={{ backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 99 }} onPress={onPress}>
        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Join</Text>
      </TouchableOpacity>
    </View>
  );
}

export const OwnedStreamTile: React.FC<Props> = ({ title, price, intensity, colors, useCases, onPress }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.tile, { backgroundColor: '#2A263E'}]}>
      {/* <View style={[styles.gradient,{backgroundColor: randomColors[0]}]} /> */}
      <View style={{backgroundColor:'#E0F0FF',width:50,height:50,borderRadius:100}}></View>
      <View style={{ flex: 1, marginLeft: 22 }}>
        <Text style={[styles.title, { color: 'white' }]}>{title}</Text>
        {price && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{price}</Text>
            {/* <Icon name="coin" size={16} color={'black'} /> */}
          </View>
        )}
        {typeof intensity === 'number' && <Text style={styles.meta}>{t('fields.intensity')} {intensity}%</Text>}
      </View>
      <TouchableOpacity style={{ backgroundColor: '#E0F0FF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 99 }} onPress={onPress}>
        <Text style={{ color: '#3F8CFF', fontSize: 14, fontWeight: '600' }}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { borderWidth: 0, borderRadius: 12, padding: 13, overflow: 'hidden', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, width: '100%', alignItems: 'center' },
  title: { color: 'black', fontSize: 20, fontWeight: '800' },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  priceText: { color: 'black', fontSize: 16, fontWeight: '700' },
  meta: { color: '#090101ff', marginTop: 8, fontSize: 12 },
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
