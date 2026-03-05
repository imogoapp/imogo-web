import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';

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

    setEmailError(isValidEmail(value) ? '' : 'Por favor, insira um email valido.');
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um email valido.');
      return;
    }

    try {
      setSending(true);
      await onSubmitPress?.({ email });
      setSent(true);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel enviar o email de recuperacao.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ImageBackground source={require('@/assets/img/bg.png')} style={styles.background} resizeMode="cover">
      <View style={styles.card}>
        <AppLogo />

        {!sent ? (
          <>
            <AppTitle marginBottom={12}>Esqueceu sua senha?</AppTitle>
            <Text style={styles.description}>
              Nao se preocupe. Enviaremos uma nova senha para o email informado.
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
                labelStyle={{ color: canSubmit ? '#F5F5F5' : '#C4C4C4' }}
                containerStyle={[styles.primaryButton, !canSubmit ? styles.disabledButton : undefined]}
              />
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.backLink}>Voltar para login</Text>
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
              Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
            </Text>
            <View style={styles.content}>
              <AppButton label="Ir para login" onPress={() => router.push('/login')} />
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}
