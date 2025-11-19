
// Poppins font family mapping
export const fonts = {
  regular: 'Poppins-Regular',
  light: 'Poppins-Light',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
  black: 'Poppins-Black',
  thin: 'Poppins-Thin',
  extraLight: 'Poppins-ExtraLight',
};

// Helper function to get font family based on fontWeight
export const getFontFamily = (fontWeight?: string | number): string => {
  if (!fontWeight) return fonts.regular;
  
  const weight = typeof fontWeight === 'string' ? fontWeight.toLowerCase() : fontWeight;
  
  if (weight === '100' || weight === 'thin') return fonts.thin;
  if (weight === '200' || weight === 'extralight' || weight === 'extra-light') return fonts.extraLight;
  if (weight === '300' || weight === 'light') return fonts.light;
  if (weight === '400' || weight === 'normal' || weight === 'regular') return fonts.regular;
  if (weight === '500' || weight === 'medium') return fonts.medium;
  if (weight === '600' || weight === 'semibold' || weight === 'semi-bold') return fonts.semiBold;
  if (weight === '700' || weight === 'bold') return fonts.bold;
  if (weight === '800' || weight === 'extrabold' || weight === 'extra-bold') return fonts.extraBold;
  if (weight === '900' || weight === 'black') return fonts.black;
  
  return fonts.regular;
};

// Helper function to create text styles with Poppins font
export const createTextStyle = (style: any) => {
  const fontWeight = style?.fontWeight;
  const fontFamily = getFontFamily(fontWeight);
  
  return {
    ...style,
    fontFamily,
    // Remove fontWeight as we're using fontFamily instead
    fontWeight: undefined,
  };
};

export const theme = {
  dark: true,
  colors: {
    bg: 'transparent',
    card: '#2A1D46',
    border: '#2A2A33',
    text: '#FFFFFF',
    subtext: '#B9B9C3',
    grey:'#6B7280',
    primary: '#FFFFFF',
    accentLoveA: '#F472B6',
    accentLoveB: '#DB2777',
    accentWealthA: '#34D399',
    accentWealthB: '#16A34A',
    green:'#1ED760',
    accentLuckA: '#FCD34D',
    accentLuckB: '#CA8A04',
    accentHealthA: '#38BDF8',
    accentHealthB: '#2563EB',
  },
  fonts,
  radius: 16,
  spacing: (n: number) => n * 8,
};
