import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';

import AccountDesktop from '@/components/screens/account/account-desktop';
import AccountMobile from '@/components/screens/account/account-mobile';
import { useScreenType } from '@/hooks/use-screen-type';
import { AuthUser, logoutSession, getSessionUser, getSession } from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function ContaScreen() {
  const { isMobile } = useScreenType();

  const [refreshCount, setRefreshCount] = useState(0);

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace('/welcome');
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
  }, []);

  const session = getSession();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(decodeUserFromSession());
  }, [session?.token, refreshCount]);

  const pageTitle = 'Minha Conta - imoGo';
  const pageDescription = 'Gerencie seus dados pessoais e altere sua senha.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      {isMobile ? (
        <AccountMobile user={user} onLogout={handleLogout} onRefresh={handleRefresh} />
      ) : (
        <AccountDesktop user={user} onLogout={handleLogout} onRefresh={handleRefresh} />
      )}
    </>
  );
}
