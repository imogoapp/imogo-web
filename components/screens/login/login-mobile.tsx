import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';

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

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setEmailError('');
      return;
    }

    setEmailError(isValidEmail(value) ? '' : 'Por favor, insira um email valido.');
  };

  const handleLogin = () => {
    if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um email valido.');
      return;
    }

    if (!password.trim()) {
      return;
    }

    if (onLoginPress) {
      onLoginPress({ email, password, remember });
      return;
    }

    router.push('/modal');
  };

  const handleForgotPassword = onForgotPasswordPress ?? (() => router.push('/modal'));
  const handleGoogle = onGooglePress ?? (() => router.push('/modal'));

  return (
    <ImageBackground source={require('@/assets/img/bg.png')} style={styles.background} resizeMode="cover">
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} translucent />

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <AppLogo width={width * 0.35} height={height * 0.12} marginBottom={0} />
        </View>

        <View style={styles.whiteContainer}>
          <AppTitle size={width * 0.05} marginBottom={height * 0.025} >
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
            />

            <AppInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureToggle
              leadingIconName="lock-closed-outline"
            />

            <View style={styles.optionsRow}>
              <AppCheckbox checked={remember} label="Lembrar senha" onToggle={() => setRemember((s) => !s)} />

              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
              </Pressable>
            </View>

            <AppButton label="Entrar" onPress={handleLogin} radius={30} />
            <AppButton
              label="Google"
              variant="secondary"
              onPress={handleGoogle}
              leftIconName="logo-google"
              radius={30}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
