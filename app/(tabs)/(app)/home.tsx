import { useCallback, useMemo } from 'react';
import { router } from 'expo-router';

import HomeDesktop from '@/components/screens/home/home-desktop';
import HomeMobile from '@/components/screens/home/home-mobile';
import { useScreenType } from '@/hooks/use-screen-type';
import { AuthUser, decodeJwtPayload, getSession } from '@/services/auth';

function decodeUserFromSession(): AuthUser | null {
  const session = getSession();
  if (!session?.token) {
    return null;
  }

  const payload = decodeJwtPayload(session.token);
  if (!payload) {
    return null;
  }

  return payload as AuthUser;
}

export default function HomeScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    router.replace('/welcome');
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  if (isMobile) {
    return <HomeMobile onLogout={handleLogout} />;
  }

  return <HomeDesktop user={user} onLogout={handleLogout} />;
}
