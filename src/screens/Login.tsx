import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,  } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';
import { login } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/config/configStore';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ILoginData } from '../store/types';


export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const {
    control,
    handleSubmit,
    formState: { errors },

  } = useForm<ILoginData>({});
  const dispatch = useDispatch<AppDispatch>()
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  console.log(errors);

  
  // const handleLogin = () => {
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Please fill in all fields');
  //     return;
  //   }

  //   if (!validateEmail(email)) {
  //     Alert.alert('Error', 'Please enter a valid email address');
  //     return;
  //   }

  //   // TODO: Implement actual login logic
  //   nav.navigate('Tabs');
  // };

  // const handleForgotPassword = () => {
  //   Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  // };

  // const handleSignUp = () => {
  //   nav.navigate('SignUp');
  // };

  const onSubmit: SubmitHandler<ILoginData> = async (data) => {
    try {
      // Clear any previous error
      setLoginError('');
      
      const payload = {
        email: data?.email,
        password: data?.password,
        returnSecureToken: true
      };
      dispatch(
        login(
          payload, 
          (email: string) => {
            console.log(email,'emaillllllllllllllllllll');
            
            // Navigate to Tabs when login is successful
            nav.navigate('Tabs');
          },
          (error: string) => {
            // Handle 401 error specifically
            setLoginError(error);
          }
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.brand}>Flow up</Text>
        <Text style={styles.welcome}>{t('auth.welcome')}</Text>
        <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={18} color={theme.colors.subtext} />
            <Controller
              control={control}
              name={'email'}
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
                  onChangeText={(text) => {
                    onChange(text);
                    // Clear error when user starts typing
                    if (loginError) setLoginError('');
                  }}
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
                  message: "Password must be at least 8 characters long",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={t('fields.password')}
                    placeholderTextColor={theme.colors.subtext}
                    value={value}   // ✅ from react-hook-form
                    onChangeText={(text) => {
                      onChange(text); // ✅ from react-hook-form
                      // Clear error when user starts typing
                      if (loginError) setLoginError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Icon
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color={theme.colors.subtext}
                    />
                  </TouchableOpacity>
                </>
              )}
            />
          </View>
          {errors.password && (
            <Text style={styles.fieldErrorText}>{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity onPress={() => { }} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        <PrimaryButton
          label={t('cta.login')}
          onPress={handleSubmit(onSubmit)}
          style={styles.loginButton}
        />

        {loginError ? (
          <Text style={styles.errorText}>{loginError}</Text>
        ) : null}

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={() => nav.navigate('SignUp')}>
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
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
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
