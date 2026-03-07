import { useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';
import { isAxiosError } from 'axios';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppTitle } from '@/components/ui/app-title';
import {
  AuthSession,
  AuthUser,
  clearSession,
  decodeJwtPayload,
  getSession,
  getTokenRemainingSeconds,
  renewToken,
  saveSession,
} from '@/services/auth';

function getErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return 'Nao foi possivel conectar com o servidor.';
  }

  const data = (error.response?.data ?? {}) as { message?: string; detail?: string };
  return data.message ?? data.detail ?? 'Nao foi possivel renovar sua sessao.';
}

function formatSeconds(seconds: number | null) {
  if (seconds === null) {
    return '--:--:--';
  }

  const safe = Math.max(0, seconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;

  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(secs).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function decodeUserFromToken(token: string) {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  return payload as AuthUser;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace('/welcome');
  }, []);

  const applyToken = useCallback((token: string) => {
    const payloadUser = decodeUserFromToken(token);
    if (!payloadUser) {
      return false;
    }

    setUser(payloadUser);
    setRemainingSeconds(getTokenRemainingSeconds(token));
    return true;
  }, []);

  const refreshJwt = useCallback(
    async (options?: { silent?: boolean }) => {
      const current = getSession();
      if (!current) {
        handleLogout();
        return false;
      }

      setRenewing(true);
      try {
        const renewedToken = await renewToken(current.key);
        const persistSession = current.remember;
        const nextSession: AuthSession = {
          key: current.key,
          token: renewedToken,
          remember: persistSession,
        };
        saveSession(nextSession, persistSession);
        setSession(nextSession);
        applyToken(renewedToken);

        if (!options?.silent) {
          Alert.alert('Sucesso', 'Token renovado com sucesso.');
        }
        return true;
      } catch (error) {
        if (!options?.silent) {
          Alert.alert('Erro ao renovar', getErrorMessage(error));
        }
        return false;
      } finally {
        setRenewing(false);
      }
    },
    [applyToken, handleLogout]
  );

  useEffect(() => {
    const current = getSession();
    if (!current) {
      return;
    }

    setSession(current);
    const tokenApplied = applyToken(current.token);
    if (!tokenApplied) {
      Alert.alert('Sessao invalida', 'Token de acesso invalido. Faca login novamente.');
      handleLogout();
      return;
    }

    setLoading(false);
  }, [applyToken, handleLogout]);

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(getTokenRemainingSeconds(session.token));
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.token]);

  useEffect(() => {
    if (!session || renewing || remainingSeconds === null) {
      return;
    }

    if (remainingSeconds > 0) {
      return;
    }

    if (session.remember) {
      void refreshJwt({ silent: true });
      return;
    }

    Alert.alert('Sessao expirada', 'Seu acesso expirou. Faca login novamente.');
    handleLogout();
  }, [handleLogout, refreshJwt, remainingSeconds, renewing, session]);

  const userRows = useMemo(() => {
    if (!user) {
      return [];
    }

    return Object.entries(user).filter(([, value]) => value !== undefined && value !== null);
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text>Carregando sessao...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AppCard>
        <AppTitle marginBottom={16}>Home</AppTitle>
        <Text style={{ marginBottom: 8 }}>Usuario autenticado via JWT</Text>
        <Text style={{ marginBottom: 8 }}>Manter login: {session?.remember ? 'sim' : 'nao'}</Text>
        <Text style={{ marginBottom: 12 }}>Tempo restante do JWT: {formatSeconds(remainingSeconds)}</Text>

        {userRows.length === 0 ? <Text>Nenhum dado de usuario no JWT.</Text> : null}

        {userRows.map(([key, value]) => (
          <Text key={key} style={{ marginBottom: 8 }}>
            {key}: {String(value)}
          </Text>
        ))}

        <View style={{ marginTop: 16, gap: 8 }}>
          <AppButton
            label={renewing ? 'Renovando token...' : 'Renovar JWT agora'}
            onPress={() => {
              void refreshJwt();
            }}
            disabled={renewing}
          />
          <AppButton label="Sair" variant="secondary" onPress={handleLogout} />
        </View>
      </AppCard>
    </ScrollView>
  );
}
