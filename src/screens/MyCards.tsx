import React, { useMemo } from 'react';
import { View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

const IMAGES: string[] = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP7W_VJW8ERhr-z-36S4DH3OmO40Fxxst1Rg&s',
  'https://www.netnewsledger.com/wp-content/uploads/2020/09/AJ-Applegate-1068x1337.jpg',
  'https://www.netnewsledger.com/wp-content/uploads/2020/09/AJ-Applegate-1068x1337.jpg',
];

const spacing = 12;
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);
const cardHeight = Math.floor(cardWidth * 1.35);

export default function MyCards() {
  const data = useMemo(() => IMAGES, []);
const nav = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: spacing }}>
		<FlatList
        data={data}
        keyExtractor={(uri, idx) => `${uri}-${idx}`}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing }}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					style={{ width: cardWidth, height: cardHeight, borderRadius: 12, overflow: 'hidden' }}
					onPress={() => nav.navigate('ImageGallery', { images: data, initialIndex: index })}
					activeOpacity={0.8}
					accessibilityRole="imagebutton"
				>
					<Image
						source={{ uri: item }}
						resizeMode="cover"
						style={{ width: '100%', height: '100%', backgroundColor: theme.colors.card }}
					/>
				</TouchableOpacity>
			)}
        contentContainerStyle={{ paddingBottom: spacing }}
      />
    </View>
  );
}


