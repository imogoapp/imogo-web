import { router } from 'expo-router';
import { Image } from 'expo-image';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { AuthDesktopShell } from '@/components/ui/auth-desktop-shell';
import { forgotPassword } from '@/services/auth';

import styles from './styles/reset-password-web-styles';

type ResetPasswordDesktopProps = {
  onSubmitPress?: (payload: { email: string }) => Promise<void> | void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ResetPasswordDesktop({ onSubmitPress }: ResetPasswordDesktopProps) {

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit = useMemo(() => isValidEmail(email) && !sending, [email, sending]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value.trim()) {
      setEmailError('');
      return;
    }

    setEmailError(isValidEmail(value) ? '' : 'Por favor, insira um email válido.');
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um email válido.');
      return;
    }

    try {
      setSending(true);
      setEmailError('');
      const normalizedEmail = email.trim();

      if (onSubmitPress) {
        await onSubmitPress({ email: normalizedEmail });
      } else {
        await forgotPassword(normalizedEmail);
      }

      setSent(true);
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status ?? error.status;
        const data = (error.response?.data ?? {}) as { message?: string; detail?: string };

        if (status === 404) {
          setEmailError('Usuário não cadastrado.');
          return;
        }

        const message = data.message ?? data.detail ?? 'Não foi possível enviar o email de recuperação.';
        Alert.alert('Erro', message);
        return;
      }

      Alert.alert('Erro', 'Não foi possível enviar o email de recuperação.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthDesktopShell
      bannerTitle="Recupere seu acesso"
      bannerSubtitle="Enviaremos um link seguro e um código de 6 dígitos para você criar uma nova senha."
    >
      <AppLogo />

        {!sent ? (
          <>
            <AppTitle marginBottom={12}>Esqueceu sua senha?</AppTitle>
            <Text style={styles.description}>
              Informe seu email para que possamos enviar instruções de redefinição de senha.
            </Text>

            <View style={styles.content}>
              <AppInput
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="exemplo@email.com"
                keyboardType="email-address"
                leadingIconName="mail-outline"
                errorMessage={emailError}
              />

              <AppButton
                label={sending ? 'Enviando...' : 'Enviar'}
                onPress={handleSubmit}
                disabled={!canSubmit}
                labelStyle={{ color: (!canSubmit || sending) ? styles.disabledButton.color : styles.primaryButton.color }}
                containerStyle={[styles.primaryButton, !canSubmit ? styles.disabledButton : undefined]}
              />
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.backLink}>Voltar para login</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.backLink}>Não tem conta? Criar cadastro</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.successWrap}>
            <Image source={require('@/assets/img/success.png')} style={styles.successImage} contentFit="contain" />
            <AppTitle marginBottom={8} color="#730d83">
              Email enviado!
            </AppTitle>
            <Text style={styles.successText}>
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </Text>
            <View style={styles.content}>
              <AppButton
                label="Já tenho o código"
                onPress={() =>
                  router.push(`/reset-password-confirm?email=${encodeURIComponent(email.trim())}` as never)
                }
              />
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.backLink}>Ir para login</Text>
              </Pressable>
            </View>
          </View>
        )}
    </AuthDesktopShell>
  );
}
