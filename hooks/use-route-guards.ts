import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { clearSession, getMe, getSession, hasValidSession } from '@/services/auth';

type GuardResult<T extends string> = {
  ready: boolean;
  redirectTo: T | null;
};

export function useLoginRequired(redirectTarget: '/welcome' | '/login' = '/welcome'): GuardResult<'/welcome' | '/login'> {
  const [result, setResult] = useState<GuardResult<'/welcome' | '/login'>>({
    ready: false,
    redirectTo: null,
  });

  useEffect(() => {
    let active = true;
    const session = getSession();
    const authenticated = hasValidSession(session);

    if (!authenticated) {
      clearSession();
      setResult({ ready: true, redirectTo: redirectTarget });
      return;
    }

    const hasCachedUser = Boolean(session?.user?.public_id && session?.user?.email);
    if (hasCachedUser) {
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
        if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          clearSession();
          setResult({ ready: true, redirectTo: redirectTarget });
          return;
        }
        if (!hasCachedUser) {
          setResult({ ready: true, redirectTo: null });
        }
      });

    return () => {
      active = false;
    };
  }, [redirectTarget]);

  return result;
}

export function useLogoutRequired(redirectTarget: '/home' = '/home'): GuardResult<'/home'> {
  const [result, setResult] = useState<GuardResult<'/home'>>({
    ready: false,
    redirectTo: null,
  });

  useEffect(() => {
    const session = getSession();
    const authenticated = hasValidSession(session);

    if (authenticated) {
      setResult({ ready: true, redirectTo: redirectTarget });
      return;
    }

    setResult({ ready: true, redirectTo: null });
  }, [redirectTarget]);

  return result;
}
