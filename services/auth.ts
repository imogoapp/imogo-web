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

export type AuthSession = {
  token: string;
  key: string;
  remember: boolean;
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

let memorySession: AuthSession | null = null;

function hasLocalStorage() {
  return typeof globalThis !== 'undefined' && 'localStorage' in globalThis && !!globalThis.localStorage;
}

function decodeBase64(value: string) {
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(value);
  }

  return Buffer.from(value, 'base64').toString('utf-8');
}

function encodeBase64(value: string) {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(value);
  }

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

export async function loginWithEmail(email: string, password: string) {
  const response = await axios.post<{ token: string; key: string }>(
    `${API_BASE_URL}/api/v2/auth/login`,
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
  const response = await axios.post<{ token: string; key: string }>(`${API_BASE_URL}/api/v2/auth/social`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function getMe(apiKey: string) {
  const response = await axios.get<AuthUser>(`${API_BASE_URL}/api/v2/auth/me`, {
    headers: {
      Accept: 'application/json',
      'X-API-Key': apiKey,
    },
  });

  return response.data;
}

export async function renewToken(apiKey: string) {
  const response = await axios.post<{ token: string }>(
    `${API_BASE_URL}/api/v2/auth/renew`,
    {},
    {
      headers: {
        Accept: 'application/json',
        'X-API-Key': apiKey,
      },
    }
  );

  const newToken = response.data.token;
  const currentSession = getSession();
  if (currentSession) {
    saveSession({ ...currentSession, token: newToken }, currentSession.remember);
  }

  return newToken;
}

export async function updateMe(apiKey: string, data: { campo: 'nome' | 'telefone'; value: string }) {
  const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/v2/auth/update`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  });

  return response.data;
}

export async function changePassword(apiKey: string, data: Record<string, string>) {
  const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/v2/auth/update-password`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  });

  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await axios.post<{ message?: string; detail?: string }>(
    `${API_BASE_URL}/api/v2/auth/forgot-password`,
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

  return isJwtValid(session.token);
}

export function isLoggedIn() {
  return hasValidSession(getSession());
}

export function getTokenRemainingSeconds(token: string) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}
