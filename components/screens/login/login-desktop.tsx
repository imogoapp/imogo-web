import { router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';

import styles from './styles/login-web-styles';

type LoginPayload = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginDesktopProps = {
  onLoginPress?: (payload: LoginPayload) => void;
  onForgotPasswordPress?: () => void;
  onGooglePress?: () => void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginDesktop({
  onLoginPress,
  onForgotPasswordPress,
  onGooglePress,
}: LoginDesktopProps) {
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
    <ImageBackground
      source={require('@/assets/img/bg.png')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.card}>
        <AppLogo />
        <AppTitle>Bem-vindo!</AppTitle>

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

          <AppButton label="Entrar" onPress={handleLogin} />

          <Text style={styles.dividerText}>Ou acesse com</Text>

          <AppButton
            label="Continuar com Google"
            variant="secondary"
            onPress={handleGoogle}
            leftIconName="logo-google"
          />          
        </View>
      </View>
    </ImageBackground>
  );
}
