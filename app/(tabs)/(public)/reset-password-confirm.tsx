import Ionicons from '@expo/vector-icons/Ionicons';
import { isAxiosError } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { useMemo, useState } from 'react';
import {
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
import { resetPassword } from '@/services/auth';

export default function ResetPasswordConfirmScreen() {
  const { isMobile } = useScreenType();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const urlToken = typeof params.token === 'string' ? params.token : '';
  const initialEmail = typeof params.email === 'string' ? params.email : '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword
      ? 'As senhas não coincidem.'
      : '';

  const canSubmit = useMemo(() => {
    if (saving) return false;
    if (newPassword.length < 6 || newPassword !== confirmPassword) return false;
    if (urlToken) return true;
    return email.trim().includes('@') && code.trim().length === 6;
  }, [saving, newPassword, confirmPassword, urlToken, email, code]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setErrorMsg('');

    try {
      await resetPassword(
        urlToken
          ? { token: urlToken, new_password: newPassword }
          : { email: email.trim(), code: code.trim(), new_password: newPassword }
      );
      setDone(true);
    } catch (err) {
      if (isAxiosError(err)) {
        const data = (err.response?.data ?? {}) as { detail?: string };
        setErrorMsg(data.detail || 'Token ou código inválido ou expirado.');
      } else {
        setErrorMsg('Não foi possível redefinir sua senha.');
      }
    } finally {
      setSaving(false);
    }
  };

  const cardContent = (
    <View style={isMobile ? styles.mobileCard : styles.desktopCard}>
      <AppLogo />

      {done ? (
        <View style={styles.centerBox}>
          <Ionicons name="checkmark-circle" size={56} color="#16A34A" />
          <AppTitle marginBottom={8}>Senha alterada!</AppTitle>
          <Text style={styles.description}>
            Sua senha foi redefinida com sucesso e suas sessões anteriores foram encerradas por segurança.
          </Text>
          <AppButton
            label="Ir para Login"
            fullWidth
            onPress={() => router.replace('/login')}
          />
        </View>
      ) : (
        <>
          <AppTitle marginBottom={10}>Criar nova senha</AppTitle>
          <Text style={styles.description}>
            {urlToken
              ? 'Digite e confirme sua nova senha abaixo.'
              : 'Informe o código de 6 dígitos enviado para o seu e-mail e defina sua nova senha.'}
          </Text>

          <View style={styles.form}>
            {!urlToken ? (
              <>
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
              </>
            ) : null}

            <AppInput
              label="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Mínimo 6 caracteres"
              secureToggle
              autoCorrect={false}
              leadingIconName="lock-closed-outline"
            />

            <AppInput
              label="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita a nova senha"
              secureToggle
              autoCorrect={false}
              leadingIconName="lock-closed-outline"
              errorMessage={passwordMismatch}
            />

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <AppButton
              label={saving ? 'Salvando...' : 'Redefinir senha'}
              fullWidth
              disabled={!canSubmit}
              onPress={() => void handleSubmit()}
            />

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
        <title>Redefinir Senha - imoGo</title>
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
          bannerTitle="Defina sua nova senha"
          bannerSubtitle="Por segurança, todas as sessões anteriores serão encerradas após a redefinição."
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
