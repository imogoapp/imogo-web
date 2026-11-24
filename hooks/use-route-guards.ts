import { isAxiosError } from 'axios';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  clearSession,
  getMe,
  getSession,
  hasValidSession,
  subscribeSessionChange,
} from '@/services/auth';

type GuardResult<T extends string> = {
  ready: boolean;
  redirectTo: T | null;
};

export function useLoginRequired(
  redirectTarget: '/welcome' | '/login' = '/welcome'
): GuardResult<'/welcome' | '/login'> {
  const pathname = usePathname();
  const [result, setResult] = useState<GuardResult<'/welcome' | '/login'>>({
    ready: false,
    redirectTo: null,
  });

  useEffect(() => {
    let active = true;

    const verifyAuth = () => {
      const session = getSession();
      const authenticated = hasValidSession(session);

      if (!authenticated) {
        if (session) {
          clearSession();
        }
        if (active) {
          setResult({ ready: true, redirectTo: redirectTarget });
        }
        return;
      }

      const hasCachedUser = Boolean(session?.user?.public_id && session?.user?.email);
      if (hasCachedUser && active) {
        setResult({ ready: true, redirectTo: null });
      }

      // Validate session against the server so remote logout takes effect immediately
      void getMe(session?.key)
        .then(() => {
          if (!active) return;
          if (!hasCachedUser) {
            setResult({ ready: true, redirectTo: null });
          }
        })
        .catch((error) => {
          if (!active) return;
          if (
            isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
          ) {
            clearSession();
            setResult({ ready: true, redirectTo: redirectTarget });
            return;
          }
          if (!hasCachedUser) {
            setResult({ ready: true, redirectTo: null });
          }
        });
    };

    verifyAuth();

    const unsubscribe = subscribeSessionChange(() => {
      if (!active) return;
      const current = getSession();
      if (!hasValidSession(current)) {
        setResult({ ready: true, redirectTo: redirectTarget });
      } else {
        setResult({ ready: true, redirectTo: null });
      }
    });

    const handleWindowChange = () => {
      verifyAuth();
    };

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', handleWindowChange);
      window.addEventListener('focus', handleWindowChange);
    }

    return () => {
      active = false;
      unsubscribe();
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('storage', handleWindowChange);
        window.removeEventListener('focus', handleWindowChange);
      }
    };
  }, [pathname, redirectTarget]);

  return result;
}

export function useLogoutRequired(redirectTarget: '/home' = '/home'): GuardResult<'/home'> {
  const pathname = usePathname();
  const [result, setResult] = useState<GuardResult<'/home'>>({
    ready: false,
    redirectTo: null,
  });

  useEffect(() => {
    const syncState = () => {
      const session = getSession();
      const authenticated = hasValidSession(session);
      setResult({ ready: true, redirectTo: authenticated ? redirectTarget : null });
    };

    syncState();
    const unsubscribe = subscribeSessionChange(syncState);

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', syncState);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('storage', syncState);
      }
    };
  }, [pathname, redirectTarget]);

  return result;
}
