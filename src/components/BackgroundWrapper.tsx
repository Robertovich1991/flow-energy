import React from 'react';
import { ImageBackground, View, StyleSheet, StatusBar, Platform } from 'react-native';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <ImageBackground 
      source={require('../assets/images/flowground.png')} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.image}
    >
      <StatusBar 
        translucent={true} 
        backgroundColor="transparent" 
        barStyle="light-content"
      />
      <View style={styles.content}>
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
  },
  image: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
  },
});
