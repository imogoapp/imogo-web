import axios from 'axios';
import { Buffer } from 'buffer';

function resolveApiBaseUrl() {
  const candidates = [process.env.EXPO_PUBLIC_API_IMOGO, process.env.API_IMOGO, 'https://api-homologacao.vercel.app'];
  const valid = candidates.find((value) => {
    if (!value) {
      return false;
    }

    const normalized = value.trim().toLowerCase();
    return normalized !== 'undefined' && normalized !== 'null';
  });

  return (valid ?? 'https://api-homologacao.vercel.app').replace(/\/+$/, '');
}

export const API_BASE_URL = resolveApiBaseUrl();
const SESSION_STORAGE_KEY = 'imogo.auth.session';

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

export type AuthUser = {
  photo?: string;
  phone?: string;
  email?: string;
  name?: string;
  status?: number;
  public_id?: string;
  profile?: number;
  exp?: number;
  [key: string]: unknown;
};

export type AuthSession = {
  token: string;
  key: string;
  remember: boolean;
  session_id?: string;
  expires_at?: string;
  user?: AuthUser;
};

export type RemoteSessionInfo = {
  id: string;
  user_id: number;
  device: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  is_current: boolean;
};

export type SocialProvider = 'google';

export type SocialLoginPayload = {
  provider: SocialProvider;
  type: 'oauth';
  provider_id: string;
  email: string;
  device: 10 | 20;
  photo_url: string;
  name: string;
};

type AuthSessionInput = {
  token: string;
  key: string;
  remember?: boolean;
  session_id?: string;
  expires_at?: string;
  user?: AuthUser;
};

let memorySession: AuthSession | null = null;

function hasLocalStorage() {
  return typeof globalThis !== 'undefined' && 'localStorage' in globalThis && !!globalThis.localStorage;
}

function decodeBase64(value: string) {
  return Buffer.from(value, 'base64').toString('utf-8');
}

function encodeBase64(value: string) {
  return Buffer.from(value, 'utf-8').toString('base64');
}

function encodeSessionForStorage(session: AuthSession) {
  const raw = JSON.stringify(session);
  return encodeBase64(raw);
}

function decodeSessionFromStorage(raw: string) {
  if (!raw) {
    return null;
  }

  const candidates = [() => decodeBase64(raw), () => raw];

  for (const getCandidate of candidates) {
    try {
      const parsed = JSON.parse(getCandidate()) as AuthSession;
      if (parsed?.key && parsed?.token && typeof parsed.remember === 'boolean') {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);

  return decodeBase64(base64 + padding);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAuthHeaders(apiKeyOverride?: string): Record<string, string> {
  const session = getSession();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const key = apiKeyOverride || session?.key;
  if (key) {
    headers['X-API-Key'] = key;
  }

  return headers;
}

export async function loginWithEmail(email: string, password: string) {
  const response = await axios.post<{
    token: string;
    key: string;
    session_id?: string;
    expires_at?: string;
    user?: AuthUser;
  }>(
    `${API_BASE_URL}/api/v3/auth/login`,
    { email, password },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export async function loginWithSocial(payload: SocialLoginPayload) {
  const response = await axios.post<{
    token: string;
    key: string;
    session_id?: string;
    expires_at?: string;
    user?: AuthUser;
  }>(`${API_BASE_URL}/api/v3/auth/social`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function getMe(apiKey?: string) {
  const response = await axios.get<AuthUser>(`${API_BASE_URL}/api/v3/auth/me`, {
    headers: getAuthHeaders(apiKey),
  });

  const currentSession = getSession();
  if (currentSession) {
    saveSession({ ...currentSession, user: response.data }, currentSession.remember);
  }

  return response.data;
}

export async function saveSessionAndFetchUser(session: AuthSessionInput, persist: boolean) {
  saveSession(session, persist);
  try {
    await getMe(session.key);
  } catch {
    // Keep session even if profile fetch fails transiently
  }
}

export async function renewToken(apiKey?: string) {
  const response = await axios.post<{ token: string; expires_at?: string }>(
    `${API_BASE_URL}/api/v3/auth/renew`,
    {},
    {
      headers: getAuthHeaders(apiKey),
    }
  );

  const newToken = response.data.token;
  const currentSession = getSession();
  if (currentSession) {
    saveSession(
      {
        ...currentSession,
        token: newToken,
        expires_at: response.data.expires_at ?? currentSession.expires_at,
      },
      currentSession.remember
    );
  }

  try {
    await getMe(apiKey);
  } catch {
    // Best-effort refresh of cached user profile
  }

  return newToken;
}

export async function logoutSession() {
  const session = getSession();
  if (session?.token) {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v3/auth/logout`,
        {},
        { headers: getAuthHeaders() }
      );
    } catch {
      // Clear local session regardless of server response
    }
  }
  clearSession();
}

export async function logoutAllSessions() {
  const session = getSession();
  if (session?.token || session?.key) {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v3/auth/logout-all`,
        {},
        { headers: getAuthHeaders() }
      );
    } catch {
      // Clear local session regardless of server response
    }
  }
  clearSession();
}

export async function listSessions() {
  const response = await axios.get<{ sessions: RemoteSessionInfo[] }>(
    `${API_BASE_URL}/api/v3/auth/sessions`,
    { headers: getAuthHeaders() }
  );
  return response.data.sessions;
}

export async function revokeRemoteSession(sessionId: string) {
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/api/v3/auth/sessions/${encodeURIComponent(sessionId)}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function updateMe(apiKey: string, data: { campo: 'nome' | 'telefone'; value: string }) {
  const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/v3/auth/update`, data, {
    headers: {
      ...getAuthHeaders(apiKey),
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function changePassword(apiKey: string, data: Record<string, string>) {
  const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/v3/auth/update-password`, data, {
    headers: {
      ...getAuthHeaders(apiKey),
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await axios.post<{ message?: string; detail?: string }>(
    `${API_BASE_URL}/api/v3/auth/forgot-password`,
    { email },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export async function resetPassword(payload: {
  token?: string;
  email?: string;
  code?: string;
  new_password: string;
}) {
  const response = await axios.post<{ message?: string; detail?: string }>(
    `${API_BASE_URL}/api/v3/auth/reset-password`,
    payload,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export async function verifyEmail(payload: {
  token?: string;
  email?: string;
  code?: string;
}) {
  const response = await axios.post<{ message?: string; detail?: string }>(
    `${API_BASE_URL}/api/v3/auth/verify-email`,
    payload,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export async function resendVerification(email: string) {
  const response = await axios.post<{ message?: string; detail?: string }>(
    `${API_BASE_URL}/api/v3/auth/resend-verification`,
    { email },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export function saveSession(session: AuthSessionInput, persist: boolean) {
  const nextSession: AuthSession = {
    ...session,
    remember: persist,
  };
  memorySession = nextSession;

  if (!persist || !hasLocalStorage()) {
    if (hasLocalStorage()) {
      globalThis.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    return;
  }

  globalThis.localStorage.setItem(SESSION_STORAGE_KEY, encodeSessionForStorage(nextSession));
}

export function getSession() {
  if (memorySession) {
    return memorySession;
  }

  if (!hasLocalStorage()) {
    return null;
  }

  const raw = globalThis.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = decodeSessionFromStorage(raw);
    if (!parsed) {
      return null;
    }

    memorySession = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionUser(): AuthUser | null {
  const session = getSession();
  if (!session) {
    return null;
  }

  if (session.user) {
    return session.user;
  }

  if (session.token && session.token.split('.').length >= 2) {
    return decodeJwtPayload(session.token) as AuthUser | null;
  }

  return null;
}

export function clearSession() {
  memorySession = null;
  if (hasLocalStorage()) {
    globalThis.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function isJwtValid(token: string) {
  if (!token?.trim()) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return false;
  }

  if (typeof payload.exp !== 'number') {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function hasValidSession(session: AuthSession | null) {
  if (!session?.token || !session?.key) {
    return false;
  }

  if (session.expires_at) {
    const expiresMs = Date.parse(session.expires_at);
    if (!Number.isNaN(expiresMs)) {
      return expiresMs > Date.now();
    }
  }

  if (session.token.split('.').length === 3) {
    return isJwtValid(session.token);
  }

  return true;
}

export function isLoggedIn() {
  return hasValidSession(getSession());
}

export function getTokenRemainingSeconds(token: string) {
  const session = getSession();
  if (session?.expires_at) {
    const expiresMs = Date.parse(session.expires_at);
    if (!Number.isNaN(expiresMs)) {
      return Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
    }
  }

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}
