
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ViewStyle, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, getFontFamily } from '../theme';
import { Icons } from '../assets/images/svg';

type Props = {
  title: string;
  price?: string;
  intensity?: number;
  image?: string;
  onPress?: () => void;
  style: ViewStyle
};

const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#EC7063',
    '#52BE80', '#5DADE2', '#F39C12', '#E74C3C', '#9B59B6',
    '#1ABC9C', '#3498DB', '#E67E22', '#E91E63', '#00BCD4',
    '#FF5722', '#009688', '#FFC107', '#9C27B0', '#3F51B5'
  ];

  const hex = colors[Math.floor(Math.random() * colors.length)];

  // Convert hex → rgba with opacity
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, 0.4)`; // <-- opacity here
};

export const CardTile: React.FC<Props> = ({ title, price, style, intensity, image, onPress }) => {
  const { t } = useTranslation();

  const randomBorderColor = useMemo(() => generateRandomColor(), []);

  const imageSource = image && image !== '/images/default.jpg'
    ? { uri: 'http://api.go2winbet.online' + image }
    : require('../assets/images/flowImage.jpg');

  const content = (
    <>
      {price && (
        <View >
          <Text style={styles.title}>{title}</Text>
          <View style={styles.priceContainer}>
            <View style={{flexDirection:'row',alignItems:'center'}}><Icons.Coins />
              <Text style={styles.priceText}>{price}</Text></View>
            <Icons.Add />
          </View>
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tile, { borderColor: randomBorderColor, ...style }]}
      activeOpacity={0.8}
    >
      {image ? (
        <View style={{ flex: 1, justifyContent: 'space-between' }}><View style={{  height: '75%', width: '80%', alignSelf: 'center',borderRadius:16,overflow:'hidden', }}><Image
          source={imageSource}
          style={styles.imageBackground}
          // imageStyle={styles.imageStyle}
          defaultSource={require('../assets/images/flowImage.jpg')}
          resizeMode="cover"
        /></View>
          <View style={styles.overlay} />
          {content}
        </View>
      ) : (
        <>
          {content}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 145,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  //  padding:9,
    width: '48%',
    height: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding:9
  },
  imageBackground: {
    flex: 1,
   // margin: 10,
    // padding: 16,
  },
  imageStyle: {
    borderRadius: 14,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 14,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    marginTop: 6,
    marginBottom: 6,
    zIndex: 1,
  },
  priceContainer: {
    marginBottom: 6,
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
    justifyContent: 'space-between'
  },
  priceText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getFontFamily('700')
  },
  meta: {
    color: 'white',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
    textAlign: 'center'
  },
});
