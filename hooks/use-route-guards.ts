import { useEffect, useState } from 'react';

import { clearSession, getSession, hasValidSession } from '@/services/auth';

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
    const session = getSession();
    const authenticated = hasValidSession(session);

    if (!authenticated) {
      clearSession();
      setResult({ ready: true, redirectTo: redirectTarget });
      return;
    }

    setResult({ ready: true, redirectTo: null });
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
