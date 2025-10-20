
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import Icon from './Icon';

type BtnProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  leftIcon?: React.ComponentProps<typeof Icon>['name'];
  rightIcon?: React.ComponentProps<typeof Icon>['name'];
  disabled?: boolean;
  loading?: boolean;
};

export const PrimaryButton: React.FC<BtnProps> = ({label, onPress, style, leftIcon, rightIcon, disabled = false, loading = false}) => (
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
          <Text style={[
            styles.primaryText, 
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
      <Text style={[styles.ghostText, leftIcon && styles.withLeft, rightIcon && styles.withRight]}>{label}</Text>
      {rightIcon && <Icon name={rightIcon} size={18} color={theme.colors.text} />}
    </View>
  </TouchableOpacity>
);

export const AppleButton: React.FC<BtnProps> = ({label, onPress, style, leftIcon, rightIcon}) => (
  <TouchableOpacity onPress={onPress} style={[styles.apple, style]}>
    <View style={styles.rowCenter}>
      {leftIcon && <Icon name={leftIcon} size={18} color="#fff" />} 
      <Text style={[styles.appleText, leftIcon && styles.withLeft, rightIcon && styles.withRight]}>{label}</Text>
      {rightIcon && <Icon name={rightIcon} size={18} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 26, alignItems: 'center', flex: 1, minWidth: 0
  },
  primaryText: { color: '#000', fontSize: 16, fontWeight: '800', flexShrink: 1 },
  disabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
  ghost: {
    borderColor: theme.colors.border, borderWidth: 2, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 26, alignItems: 'center', flex: 1, minWidth: 0
  },
  ghostText: { color: theme.colors.text, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  apple: {
    backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 26, alignItems: 'center', flex: 1, minWidth: 0
  },
  appleText: { color: '#fff', fontSize: 16, fontWeight: '700', flexShrink: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  withLeft: { marginLeft: 8 },
  withRight: { marginRight: 8 }
});
