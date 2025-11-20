import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme, getFontFamily } from '../theme';

export interface TextProps extends RNTextProps {
  weight?: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black' | string | number;
}

export const Text: React.FC<TextProps> = ({ style, weight, ...props }) => {
  const fontFamily = weight ? getFontFamily(weight) : theme.fonts.regular;
  
  return (
    <RNText
      style={[
        { fontFamily },
        style,
      ]}
      {...props}
    />
  );
};

export default Text;






