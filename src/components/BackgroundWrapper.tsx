import React from 'react';
import { ImageBackground, View, StyleSheet, StatusBar, Platform } from 'react-native';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  topPadding?: number;
}

export default function BackgroundWrapper({ children, topPadding }: BackgroundWrapperProps) {
  return (
    <ImageBackground 
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.image}
    >
      <StatusBar 
        translucent={true} 
        backgroundColor="transparent" 
        barStyle="light-content"
      />
      <View style={[styles.content, topPadding !== undefined && { paddingTop: topPadding }]}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 0,
    backgroundColor: '#161427',
  },
  image: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
  },
});
