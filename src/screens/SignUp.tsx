import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ISignUpData } from '../store/types';
import { register } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/config/configStore';

export default function SignUp() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ISignUpData>();
const dispatch = useDispatch<AppDispatch>()

  const onSubmit: SubmitHandler<ISignUpData> = async (data) => {
    try {
      dispatch(
        register(data, () => {
          Alert.alert('Success', 'User registered successfully! Please login to your account', [
            {
              text: 'OK',
              onPress: () => nav.navigate('Login')
            }
          ]);
        })
      );
    } catch (error) {
      console.error('SignUp error:', error);
    }
  };

  const handleLogin = () => {
    nav.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.brand}>Flow up</Text>
        <Text style={styles.welcome}>{t('auth.createAccount')}</Text>
        <Text style={styles.subtitle}>{t('auth.signUpSubtitle')}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={18} color={theme.colors.subtext} />
            <Controller
              control={control}
              name="name"
              rules={{
                required: t("Errors.Required"),
                minLength: {
                  value: 2,
                  message: t("Errors.Name_Too_Short"),
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={t('fields.name')}
                  placeholderTextColor={theme.colors.subtext}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              )}
            />
          </View>
          {errors.name && (
            <Text style={styles.fieldErrorText}>{errors.name.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={18} color={theme.colors.subtext} />
            <Controller
              control={control}
              name="email"
              rules={{
                required: t("Errors.Required"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("Errors.Invalid_Email"),
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={t('fields.email')}
                  placeholderTextColor={theme.colors.subtext}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
          </View>
          {errors.email && (
            <Text style={styles.fieldErrorText}>{errors.email.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={18} color={theme.colors.subtext} />
            <Controller
              control={control}
              name="password"
              rules={{
                required: t("Errors.Required"),
                minLength: {
                  value: 8,
                  message: t("Errors.Password_Too_Short"),
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={t('fields.password')}
                    placeholderTextColor={theme.colors.subtext}
                    value={value}
                    onChangeText={onChange}
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
                </>
              )}
            />
          </View>
          {errors.password && (
            <Text style={styles.fieldErrorText}>{errors.password.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={18} color={theme.colors.subtext} />
            <Controller
              control={control}
              name="password_confirmation"
              rules={{
                required: t("Errors.Required"),
                validate: (value) => {
                  const password = watch('password');
                  return value === password || t("Errors.Password_Mismatch");
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={t('fields.confirmPassword')}
                    placeholderTextColor={theme.colors.subtext}
                    value={value}
                    onChangeText={onChange}
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
                </>
              )}
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.fieldErrorText}>{errors.confirmPassword.message}</Text>
          )}
        </View>

        <PrimaryButton 
          label={t('cta.signUp')} 
          onPress={handleSubmit(onSubmit)}
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
  fieldErrorText: {
    color: '#FF4444',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
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
