
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Icons } from '../assets/images/svg';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  image?: string;
  onPress?: () => void;
};


export const CardTile: React.FC<Props> = ({title, price, intensity, image, onPress}) => {
  const { t } = useTranslation();


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
  meta: { color:'white', marginTop: 6, fontSize: 14,fontWeight:'700', textAlign: 'center' },
});
