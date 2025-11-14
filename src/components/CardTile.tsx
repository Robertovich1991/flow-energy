
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Icon } from './Icon';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  image?: string;
  onPress?: () => void;
};


export const CardTile: React.FC<Props> = ({title, price, intensity, image, onPress}) => {
  const { t } = useTranslation();

  const content = (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      {price && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price}</Text>
          <Icon name="coin" size={14} color={theme.colors.primary} />
        </View>
      )}
      {typeof intensity === 'number' && <Text style={styles.meta}>{t('fields.intensity')} {intensity}%</Text>}
    </View>
  );

  return (
    <TouchableOpacity onPress={onPress} style={[styles.tile, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
      {image ? (
        <ImageBackground 
          source={{ uri: image.startsWith('http') ? image : `http://api.go2winbet.online${image}` }}
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={styles.backgroundImageStyle}
        >
          {content}
        </ImageBackground>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: { borderWidth: 0, borderRadius: 16, overflow: 'hidden', marginBottom: 12, width: '48%', height: 160 },
  backgroundImage: { flex: 1 },
  backgroundImageStyle: { borderRadius: 16, opacity: 0.8 },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 6, marginBottom: 6, textAlign: 'center' },
  priceContainer: { marginBottom: 6, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  priceText: { color: theme.colors.primary, fontSize: 14, fontWeight: '700' },
  meta: { color:'white', marginTop: 6, fontSize: 14,fontWeight:'700', textAlign: 'center' },
});
