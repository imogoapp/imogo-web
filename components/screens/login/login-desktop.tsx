import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { AuthDesktopShell } from '@/components/ui/auth-desktop-shell';
import { useGoogleSocialLogin } from '@/hooks/use-google-social-login';
import { loginWithEmail, saveSessionAndFetchUser } from '@/services/auth';

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

const MIN_PASSWORD_LENGTH = 6;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getPasswordLengthError(passwordValue: string) {
  return passwordValue.length > 0 && passwordValue.length < MIN_PASSWORD_LENGTH
    ? `A senha deve ter no minimo ${MIN_PASSWORD_LENGTH} caracteres.`
    : '';
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
  const passwordLengthError = getPasswordLengthError(password);
  const canLogin = useMemo(
    () => isValidEmail(email) && password.trim().length >= MIN_PASSWORD_LENGTH,
    [email, password]
  );

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

    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`A senha deve ter no minimo ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setLoading(true);
    setPasswordError('');

    try {
      const session = await loginWithEmail(email.trim(), password);
      await saveSessionAndFetchUser(session, remember);
      onLoginPress?.({ email, password, remember });
      router.replace('/home');
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = (error.response?.data ?? {}) as {
          message?: string;
          detail?: string;
          code?: string;
          email?: string;
        };
        const status = error.response?.status ?? error.status;
        if (status === 403 && errorData.code === 'EMAIL_NOT_VERIFIED') {
          const targetEmail = errorData.email || email.trim();
          router.replace(`/verify-email?email=${encodeURIComponent(targetEmail)}` as never);
          return;
        }
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
    <AuthDesktopShell
      bannerTitle="Acesse sua conta imoGo"
      bannerSubtitle="Continue suas simulações de crédito, acompanhe certidões e gerencie suas sessões com segurança."
    >
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
            errorMessage={passwordError || passwordLengthError}
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
            labelStyle={{ color: (!canLogin || loading) ? styles.disabledButton.color : styles.primaryButton.color }}
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

          <TouchableOpacity onPress={() => router.push('/register')} style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: '#730d83', fontSize: 14, fontWeight: 'bold' }}>Não tem uma conta? Criar cadastro</Text>
          </TouchableOpacity>
        </View>
    </AuthDesktopShell>
  );
}
