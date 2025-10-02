import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // TODO: Implement actual login logic
    nav.navigate('Tabs');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  const handleSignUp = () => {
    nav.navigate('SignUp');
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.brand}>Flow</Text>
        <Text style={styles.welcome}>{t('auth.welcome')}</Text>
        <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={18} color={theme.colors.subtext} />
            <TextInput
              style={styles.input}
              placeholder={t('fields.email')}
              placeholderTextColor={theme.colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={18} color={theme.colors.subtext} />
            <TextInput
              style={styles.input}
              placeholder={t('fields.password')}
              placeholderTextColor={theme.colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={18} color={theme.colors.subtext} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        <PrimaryButton 
          label={t('cta.login')} 
          onPress={handleLogin}
          style={styles.loginButton}
        />

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>{t('auth.signUpLink')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.bg, 
    padding: 16 
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  brand: { 
    color: '#fff', 
    fontSize: 40, 
    fontWeight: '900', 
    marginBottom: 8 
  },
  welcome: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 4 
  },
  subtitle: { 
    color: theme.colors.subtext, 
    fontSize: 16 
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 2,
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.colors.subtext,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  signUpLink: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
