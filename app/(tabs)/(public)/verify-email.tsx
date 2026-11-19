import Ionicons from '@expo/vector-icons/Ionicons';
import { isAxiosError } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { AuthDesktopShell } from '@/components/ui/auth-desktop-shell';
import { AppTheme } from '@/constants/app-theme';
import { useScreenType } from '@/hooks/use-screen-type';
import { resendVerification, verifyEmail } from '@/services/auth';

export default function VerifyEmailScreen() {
  const { isMobile } = useScreenType();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const urlToken = typeof params.token === 'string' ? params.token : '';
  const initialEmail = typeof params.email === 'string' ? params.email : '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(Boolean(urlToken));
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (!urlToken) return;
    let active = true;
    setLoading(true);
    setErrorMsg('');

    void verifyEmail({ token: urlToken })
      .then(() => {
        if (active) setVerified(true);
      })
      .catch((err) => {
        if (!active) return;
        if (isAxiosError(err)) {
          const data = (err.response?.data ?? {}) as { detail?: string };
          setErrorMsg(data.detail || 'Link de verificação inválido ou expirado.');
        } else {
          setErrorMsg('Não foi possível verificar seu e-mail.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [urlToken]);

  const canVerifyCode = useMemo(
    () => email.trim().includes('@') && code.trim().length === 6 && !loading,
    [email, code, loading]
  );

  const handleVerifyCode = async () => {
    if (!canVerifyCode) return;
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      await verifyEmail({ email: email.trim(), code: code.trim() });
      setVerified(true);
    } catch (err) {
      if (isAxiosError(err)) {
        const data = (err.response?.data ?? {}) as { detail?: string };
        setErrorMsg(data.detail || 'Código inválido ou expirado.');
      } else {
        setErrorMsg('Não foi possível validar o código.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim().includes('@')) {
      setErrorMsg('Informe seu e-mail para reenviar a verificação.');
      return;
    }

    setResending(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      await resendVerification(email.trim());
      setInfoMsg('E-mail de verificação reenviado! Confira sua caixa de entrada e spam.');
    } catch (err) {
      if (isAxiosError(err)) {
        const data = (err.response?.data ?? {}) as { detail?: string };
        setErrorMsg(data.detail || 'Não foi possível reenviar o e-mail.');
      } else {
        setErrorMsg('Não foi possível reenviar o e-mail.');
      }
    } finally {
      setResending(false);
    }
  };

  const cardContent = (
    <View style={isMobile ? styles.mobileCard : styles.desktopCard}>
      <AppLogo />

      {loading && urlToken ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
          <Text style={styles.description}>Validando seu e-mail...</Text>
        </View>
      ) : verified ? (
        <View style={styles.centerBox}>
          <Ionicons name="checkmark-circle" size={56} color="#16A34A" />
          <AppTitle marginBottom={8}>E-mail verificado!</AppTitle>
          <Text style={styles.description}>
            Sua conta foi ativada com sucesso. Agora você já pode acessar o sistema.
          </Text>
          <AppButton
            label="Ir para Login"
            fullWidth
            onPress={() => router.replace('/login')}
          />
        </View>
      ) : (
        <>
          <AppTitle marginBottom={10}>Confirme seu e-mail</AppTitle>
          <Text style={styles.description}>
            Enviamos um link de confirmação e um código de 6 dígitos para o seu e-mail. Valide sua conta para acessar o sistema.
          </Text>

          <View style={styles.form}>
            <AppInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIconName="mail-outline"
            />

            <AppInput
              label="Código de 6 dígitos"
              value={code}
              onChangeText={(val) => setCode(val.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              leadingIconName="key-outline"
            />

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            {infoMsg ? <Text style={styles.infoText}>{infoMsg}</Text> : null}

            <AppButton
              label={loading ? 'Validando...' : 'Validar e-mail'}
              fullWidth
              disabled={!canVerifyCode}
              onPress={() => void handleVerifyCode()}
            />

            <Pressable
              style={styles.secondaryAction}
              onPress={() => void handleResend()}
              disabled={resending}
            >
              <Text style={styles.secondaryActionText}>
                {resending ? 'Reenviando...' : 'Reenviar e-mail de verificação'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.backLink}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.backLinkText}>Voltar para o login</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );

  return (
    <>
      <Head>
        <title>Verificar E-mail - imoGo</title>
      </Head>

      {isMobile ? (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.mobileScroll} keyboardShouldPersistTaps="handled">
              {cardContent}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      ) : (
        <AuthDesktopShell
          bannerTitle="Confirme seu e-mail"
          bannerSubtitle="Validar seu e-mail garante mais segurança para suas simulações, certidões e sessões conectadas."
        >
          {cardContent}
        </AuthDesktopShell>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: AppTheme.colors.background },
  background: { flex: 1, width: '100%', height: '100%' },
  desktopScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mobileScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  desktopCard: {
    width: '100%',
    alignItems: 'center',
  },
  mobileCard: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    alignItems: 'center',
  },
  centerBox: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: AppTheme.colors.muted,
    fontFamily: AppTheme.typography.fontRegular,
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  errorText: {
    fontSize: 13,
    color: '#D9534F',
    fontFamily: AppTheme.typography.fontBold,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#065F46',
    fontFamily: AppTheme.typography.fontBold,
    textAlign: 'center',
  },
  secondaryAction: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
    textDecorationLine: 'underline',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  backLinkText: {
    fontSize: 13,
    color: '#888888',
    fontFamily: AppTheme.typography.fontRegular,
  },
});
