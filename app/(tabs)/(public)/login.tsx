import Head from 'expo-router/head';

import LoginDesktop from '@/components/screens/login/login-desktop';
import LoginMobile from '@/components/screens/login/login-mobile';
import { useScreenType } from '@/hooks/use-screen-type';

export default function LoginScreen() {
  const { isMobile } = useScreenType();

  const pageTitle = 'Fazer login na imoGo';
  const pageDescription = 'Acesse sua conta na imoGo para continuar sua jornada de vendas e captacao.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      {isMobile ? <LoginMobile /> : <LoginDesktop />}
    </>
  );
}
