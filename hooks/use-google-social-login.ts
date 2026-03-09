import { useCallback, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { AuthSessionResult } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { decodeJwtPayload, loginWithSocial, saveSession } from '@/services/auth';

WebBrowser.maybeCompleteAuthSession();

type GoogleProfile = {
  sub: string;
  email: string;
  name: string;
  picture: string;
};

type GoogleLoginResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      cancelled?: boolean;
    };

type LoginDevice = 10 | 20;

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getGoogleClientConfig() {
  return {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  };
}

function decodeGoogleIdToken(idToken: string): GoogleProfile | null {
  const payload = decodeJwtPayload(idToken);
  if (!payload) {
    return null;
  }

  const profile: GoogleProfile = {
    sub: asString(payload.sub),
    email: asString(payload.email),
    name: asString(payload.name),
    picture: asString(payload.picture),
  };

  if (!profile.sub || !profile.email || !profile.name) {
    return null;
  }

  return profile;
}

function extractIdTokenFromResult(result: AuthSessionResult) {
  if (result.type !== 'success') {
    return '';
  }

  const params = 'params' in result ? (result.params as Record<string, string | undefined>) : null;
  return params?.id_token ?? '';
}

export function useGoogleSocialLogin() {
  const [loading, setLoading] = useState(false);
  const clientConfig = useMemo(() => getGoogleClientConfig(), []);
  const hasAnyClientId = useMemo(
    () => !!(clientConfig.webClientId || clientConfig.iosClientId || clientConfig.androidClientId),
    [clientConfig.androidClientId, clientConfig.iosClientId, clientConfig.webClientId]
  );

  const [, , promptAsync] = Google.useIdTokenAuthRequest({
    ...clientConfig,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  });

  const login = useCallback(
    async (persist: boolean, device: LoginDevice): Promise<GoogleLoginResult> => {
      if (!hasAnyClientId) {
        return { ok: false, message: 'Google OAuth nao configurado. Defina os client IDs no .env.' };
      }

      setLoading(true);
      try {
        const result = await promptAsync();
        if (result.type === 'cancel' || result.type === 'dismiss') {
          return { ok: false, message: 'Login com Google cancelado.', cancelled: true };
        }

        if (result.type !== 'success') {
          return { ok: false, message: 'Nao foi possivel autenticar com o Google.' };
        }

        const idToken = extractIdTokenFromResult(result);
        if (!idToken) {
          return { ok: false, message: 'Google nao retornou id_token para concluir o login.' };
        }

        const profile = decodeGoogleIdToken(idToken);
        if (!profile) {
          return { ok: false, message: 'Nao foi possivel ler os dados da conta Google.' };
        }

        const session = await loginWithSocial({
          provider: 'google',
          type: 'oauth',
          provider_id: profile.sub,
          email: profile.email,
          device,
          photo_url: profile.picture,
          name: profile.name,
        });

        saveSession(session, persist);
        return { ok: true };
      } catch (error) {
        if (isAxiosError(error)) {
          const data = (error.response?.data ?? {}) as { message?: string; detail?: string };
          return { ok: false, message: data.message ?? data.detail ?? 'Nao foi possivel concluir o login social.' };
        }

        return { ok: false, message: 'Erro ao conectar com o servidor durante o login social.' };
      } finally {
        setLoading(false);
      }
    },
    [hasAnyClientId, promptAsync]
  );

  return {
    loading,
    login,
  };
}
