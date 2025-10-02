import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';

export default function SignUp() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // TODO: Implement actual sign up logic
    Alert.alert('Success', 'Account created successfully!');
    nav.navigate('Tabs');
  };

  const handleLogin = () => {
    nav.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.brand}>Flow</Text>
        <Text style={styles.welcome}>{t('auth.createAccount')}</Text>
        <Text style={styles.subtitle}>{t('auth.signUpSubtitle')}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={18} color={theme.colors.subtext} />
            <TextInput
              style={styles.input}
              placeholder={t('fields.name')}
              placeholderTextColor={theme.colors.subtext}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

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

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={18} color={theme.colors.subtext} />
            <TextInput
              style={styles.input}
              placeholder={t('fields.confirmPassword')}
              placeholderTextColor={theme.colors.subtext}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={18} color={theme.colors.subtext} />
            </TouchableOpacity>
          </View>
        </View>

        <PrimaryButton 
          label={t('cta.signUp')} 
          onPress={handleSignUp}
          style={styles.signUpButton}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t('auth.hasAccount')} </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>{t('auth.loginLink')}</Text>
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
  signUpButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
