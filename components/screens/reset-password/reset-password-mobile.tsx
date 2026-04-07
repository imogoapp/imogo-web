import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { forgotPassword } from '@/services/auth';

import { createResetPasswordMobileStyles } from './styles/reset-password-mobile-styles';

type ResetPasswordMobileProps = {
  onSubmitPress?: (payload: { email: string }) => Promise<void> | void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ResetPasswordMobile({ onSubmitPress }: ResetPasswordMobileProps) {

  const { width, height } = useWindowDimensions();
  const styles = createResetPasswordMobileStyles(width, height);

  const titleSize =
    Platform.select({ ios: width * 0.055, android: width * 0.05, default: width * 0.05 }) ?? width * 0.05;
  const descSize = Platform.select({ ios: width * 0.036, android: width * 0.034, default: width * 0.034 }) ?? width * 0.034;
  const labelSize =
    Platform.select({ ios: width * 0.033, android: width * 0.032, default: width * 0.032 }) ?? width * 0.032;
  const nativeInputSize =
    Platform.select({ ios: width * 0.04, android: width * 0.038, default: width * 0.038 }) ?? width * 0.038;
  const inputSize = Platform.OS === 'web' ? Math.max(nativeInputSize, 16) : nativeInputSize;
  const buttonTextSize = width * 0.04;

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
              {!sent ? (
                <>
                  <AppTitle size={titleSize} marginBottom={height * 0.012} align="left" style={styles.title}>
                    Esqueceu sua senha?
                  </AppTitle>

                  <Text style={[styles.description, { fontSize: descSize }]}>
                    Informe seu email para que possamos enviar instruções de redefinição de senha.
                  </Text>

                  <View style={styles.form}>
                    <AppInput
                      label="Email"
                      value={email}
                      onChangeText={handleEmailChange}
                      placeholder="exemplo@email.com"
                      keyboardType="email-address"
                      leadingIconName="mail-outline"
                      errorMessage={emailError}
                      labelSize={labelSize}
                      inputSize={inputSize}
                      minHeight={height * 0.055}
                      radius={8}
                      autoCorrect={false}
                    />

                    <AppButton
                      label={sending ? 'Enviando...' : 'Enviar'}
                      onPress={handleSubmit}
                      disabled={!canSubmit}
                      radius={30}
                      size="sm"
                      labelStyle={{ color: (!canSubmit || sending) ? styles.buttonDisabled.color : styles.primaryButton.color }}
                      containerStyle={[styles.primaryButton, !canSubmit ? styles.buttonDisabled : undefined]}
                    />

                    <Pressable onPress={() => router.push('/login')}>
                      <Text style={[styles.backLink, { fontSize: labelSize }]}>Voltar para login</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View style={styles.successWrap}>
                  <Image source={require('@/assets/img/success.png')} style={styles.successImage} contentFit="contain" />
                  <AppTitle size={titleSize} marginBottom={height * 0.008} color="#730d83">
                    Email enviado!
                  </AppTitle>
                  <Text style={[styles.successText, { fontSize: descSize }]}>
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </Text>
                  <View style={styles.form}>
                    <AppButton
                      label="Ir para login"
                      onPress={() => router.push('/login')}
                      radius={30}
                      size="sm"
                      labelStyle={{ fontSize: buttonTextSize }}
                      containerStyle={{ minHeight: 48, paddingVertical: 12 }}
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
