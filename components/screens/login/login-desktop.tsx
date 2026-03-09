import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { useGoogleSocialLogin } from '@/hooks/use-google-social-login';
import { loginWithEmail, saveSession } from '@/services/auth';

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
  const [passwordError, setPasswordError] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const { loading: googleLoading, login: loginWithGoogle } = useGoogleSocialLogin();
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
  const handleGoogle = async () => {
    const result = await loginWithGoogle(remember, 20);
    if (!result.ok) {
      if (!result.cancelled) {
        Alert.alert('Erro no login social', result.message);
      }
      return;
    }

    onGooglePress?.();
    router.replace('/home');
  };

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
            onChangeText={(value) => {
              setPassword(value);
              setPasswordError('');
            }}
            placeholder="Senha"
            secureToggle
            leadingIconName="lock-closed-outline"
            errorMessage={passwordError}
          />

          <View style={styles.optionsRow}>
            <AppCheckbox checked={remember} label="Lembrar senha" onToggle={() => setRemember((s) => !s)} />

            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </Pressable>
          </View>

          <AppButton
            label={loading ? 'Entrando...' : 'Entrar'}
            onPress={handleLogin}
            disabled={loading || !canLogin}
            labelStyle={{ color: canLogin ? '#F5F5F5' : '#C4C4C4' }}
            containerStyle={[styles.primaryButton, loading || !canLogin ? styles.disabledButton : undefined]}
          />

          <Text style={styles.dividerText}>Ou acesse com</Text>

          <AppButton
            label={googleLoading ? 'Conectando com Google...' : 'Continuar com Google'}
            variant="secondary"
            onPress={handleGoogle}
            disabled={googleLoading || loading}
            leftIconName="logo-google"
          />          
        </View>
      </View>
    </ImageBackground>
  );
}
