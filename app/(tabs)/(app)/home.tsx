import { useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';


import HomeDesktop from '@/components/screens/home/home-desktop';
import HomeMobile from '@/components/screens/home/home-mobile';
import { useScreenType } from '@/hooks/use-screen-type';
import { AuthUser, clearSession, decodeJwtPayload, getSession } from '@/services/auth';

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
    clearSession();
    router.replace('/welcome');
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  const pageTitle = 'imoGo App';
  const pageDescription = 'Bem vindo a imoGo.';

  return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
        </Head>
  
        {isMobile ? <HomeMobile onLogout={handleLogout} /> : <HomeDesktop user={user} onLogout={handleLogout} />}
      </>
    );

}


// 

