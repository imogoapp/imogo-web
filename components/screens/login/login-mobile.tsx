import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  SafeAreaView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { loginWithEmail, saveSession } from '@/services/auth';

import { createLoginMobileStyles } from './styles/login-mobile-styles';

type LoginPayload = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginMobileProps = {
  onLoginPress?: (payload: LoginPayload) => void;
  onForgotPasswordPress?: () => void;
  onGooglePress?: () => void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginMobile({
  onLoginPress,
  onForgotPasswordPress,
  onGooglePress,
}: LoginMobileProps) {
  const { width, height } = useWindowDimensions();
  const styles = createLoginMobileStyles(width, height);
  const titleSize =
    Platform.select({ ios: width * 0.055, android: width * 0.05, default: width * 0.05 }) ?? width * 0.05;
  const labelSize =
    Platform.select({ ios: width * 0.033, android: width * 0.032, default: width * 0.032 }) ?? width * 0.032;
  const nativeInputSize =
    Platform.select({ ios: width * 0.04, android: width * 0.038, default: width * 0.038 }) ?? width * 0.038;
  const inputSize = Platform.OS === 'web' ? Math.max(nativeInputSize, 16) : nativeInputSize;
  const buttonTextSize = width * 0.04;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const canLogin = useMemo(() => isValidEmail(email) && !!password.trim(), [email, password]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setPasswordError('');

    if (!value.trim()) {
      setEmailError('');
      return;
    }

    setEmailError(isValidEmail(value) ? '' : 'Por favor, insira um email valido.');
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um email valido.');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Informe sua senha.');
      return;
    }

    setLoading(true);
    setPasswordError('');

    try {
      const session = await loginWithEmail(email.trim(), password);
      saveSession(session, remember);
      onLoginPress?.({ email, password, remember });
      router.replace('/home');
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = (error.response?.data ?? {}) as { message?: string; detail?: string };
        const status = error.response?.status ?? error.status;
        const message =
          status === 401
            ? 'Email ou senha invalidos.'
            : errorData.message ?? errorData.detail ?? 'Nao foi possivel fazer login.';
        setPasswordError(message);
        Alert.alert('Erro no login', message);
      } else {
        setPasswordError('Nao foi possivel conectar com o servidor.');
        Alert.alert('Erro no login', 'Nao foi possivel conectar com o servidor.');
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = onForgotPasswordPress ?? (() => router.push('/reset-password'));
  const handleGoogle = onGooglePress ?? (() => router.push('/modal'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('@/assets/img/bg.png')} style={styles.background} resizeMode="cover">
        <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} translucent />

        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            bounces={false}>
            <View style={styles.logoContainer}>
              <AppLogo width={width * 0.35} height={height * 0.08} marginBottom={0} />
            </View>

            <View style={styles.whiteContainer}>
              <AppTitle size={titleSize} marginBottom={height * 0.015} align="left" style={styles.title}>
                Bem-vindo!
              </AppTitle>

              <View style={styles.form}>
                <AppInput
                  label="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Email"
                  keyboardType="email-address"
                  leadingIconName="mail-outline"
                  errorMessage={emailError}
                  labelSize={labelSize}
                  inputSize={inputSize}
                  minHeight={height * 0.055}
                  radius={8}
                  wrapperBackgroundColor="#ffffff"
                  wrapperBorderColor="#EAEAEA"
                  autoCorrect={false}
                />

                <AppInput
                  label="Senha"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setPasswordError('');
                  }}
                  placeholder="Senha"
                  secureToggle
                  leadingIconName="lock-closed-outline"
                  errorMessage={passwordError}
                  labelSize={labelSize}
                  inputSize={inputSize}
                  minHeight={height * 0.055}
                  radius={8}
                  wrapperBackgroundColor="#ffffff"
                  wrapperBorderColor="#EAEAEA"
                  autoCorrect={false}
                />

                <View style={styles.optionsRow}>
                  <AppCheckbox checked={remember} label="Manter Login" onToggle={() => setRemember((s) => !s)} />

                  <Pressable onPress={handleForgotPassword}>
                    <Text style={[styles.forgotText, { fontSize: labelSize }]}>Esqueceu sua senha?</Text>
                  </Pressable>
                </View>

                <AppButton
                  label={loading ? 'Entrando...' : 'Entrar'}
                  onPress={handleLogin}
                  disabled={loading || !canLogin}
                  radius={30}
                  size="sm"
                  labelStyle={{ fontSize: buttonTextSize, color: canLogin ? '#F5F5F5' : '#C4C4C4' }}
                  containerStyle={[styles.primaryButton, loading || !canLogin ? styles.buttonDisabled : undefined]}
                />
                <AppButton
                  label="Continuar com Google"
                  variant="secondary"
                  onPress={handleGoogle}
                  leftIconName="logo-google"
                  radius={30}
                  size="sm"
                  labelStyle={{ fontSize: buttonTextSize }}
                  containerStyle={styles.secondaryButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
