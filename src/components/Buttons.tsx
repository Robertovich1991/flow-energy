
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View, ActivityIndicator } from 'react-native';
import { theme, getFontFamily } from '../theme';
import Icon from './Icon';
import { TextStyle } from 'react-native/types_generated/index';

type BtnProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  leftIcon?: React.ComponentProps<typeof Icon>['name'];
  rightIcon?: React.ComponentProps<typeof Icon>['name'];
  disabled?: boolean;
  loading?: boolean;
  textStyle?: TextStyle
};

export const PrimaryButton: React.FC<BtnProps> = ({label, textStyle, onPress, style, leftIcon, rightIcon, disabled = false, loading = false}) => (
  <TouchableOpacity 
    onPress={() => { !disabled && !loading && onPress && onPress(); }} 
    style={[
      styles.primary, 
      (disabled || loading) && styles.disabled,
      style
    ]}
    disabled={disabled || loading}
  >
    <View style={styles.rowCenter}>
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <>
          {leftIcon && <Icon name={leftIcon} size={18} color="#000" />}
          <Text 
            numberOfLines={2}
            style={[,
              
              styles.primaryText, textStyle && textStyle,
              (disabled || loading) && styles.disabledText,
              leftIcon && styles.withLeft, 
              rightIcon && styles.withRight
            ]}>{label}</Text>
          {rightIcon && <Icon name={rightIcon} size={18} color="#000" />}
        </>
      )}
    </View>
  </TouchableOpacity>
);

export const GhostButton: React.FC<BtnProps> = ({label, onPress, style, leftIcon, rightIcon}) => (
  <TouchableOpacity onPress={onPress} style={[styles.ghost, style]}>
    <View style={styles.rowCenter}>
      {leftIcon && <Icon name={leftIcon} size={18} color={theme.colors.text} />} 
      <Text 
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[styles.ghostText, leftIcon && styles.withLeft, rightIcon && styles.withRight]}>{label}</Text>
      {rightIcon && <Icon name={rightIcon} size={18} color={theme.colors.text} />}
    </View>
  </TouchableOpacity>
);

export const SubmitButton: React.FC<BtnProps> = ({label, onPress, style, leftIcon, rightIcon}) => (
  <TouchableOpacity onPress={onPress} style={[styles.submit, style]}>
      <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.submitText]}>{label}</Text>
  </TouchableOpacity>
);

export const AppleButton: React.FC<BtnProps> = ({label, onPress, style, leftIcon, rightIcon}) => (
  <TouchableOpacity onPress={onPress} style={[styles.apple, style]}>
    <View style={styles.rowCenter}>
      {leftIcon && <Icon name={leftIcon} size={18} color="#fff" />} 
      <Text 
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[styles.appleText, leftIcon && styles.withLeft, rightIcon && styles.withRight]}>{label}</Text>
      {rightIcon && <Icon name={rightIcon} size={18} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,paddingVertical:8, paddingHorizontal: 28, borderRadius: 96, alignItems: 'center',justifyContent:"center" 
  },
  primaryText: { color:'black', fontSize: 16, fontWeight: '800', fontFamily: getFontFamily('800') },
  disabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
   submit: {
    borderColor: theme.colors.border,  paddingVertical: 16, paddingHorizontal: 18, borderRadius: 16, alignItems: 'center',
  },
  submitText:{
    color: 'white',
fontSize:18,
fontWeight:"400",
fontFamily: getFontFamily('400'),
letterSpacing:0.9
  },
  ghost: {
    borderColor: theme.colors.border, borderWidth: 2, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 26, alignItems: 'center', flex: 1, minWidth: 0
  },
  ghostText: { color: 'white', fontSize: 16, fontWeight: '700', fontFamily: getFontFamily('700'), flexShrink: 1 },
  apple: {
    backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 26, alignItems: 'center', flex: 1, minWidth: 0
  },
  appleText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: getFontFamily('700'), flexShrink: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  withLeft: { marginLeft: 8 },
  withRight: { marginRight: 8 }
});
