import Head from 'expo-router/head';

import ResetPasswordDesktop from '@/components/screens/reset-password/reset-password-desktop';
import ResetPasswordMobile from '@/components/screens/reset-password/reset-password-mobile';
import { useScreenType } from '@/hooks/use-screen-type';

export default function ResetPasswordScreen() {
  const { isMobile } = useScreenType();
  const pageTitle = 'Recuperar senha na imoGo';
  const pageDescription = 'Solicite uma nova senha para acessar sua conta na imoGo.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      {isMobile ? <ResetPasswordMobile /> : <ResetPasswordDesktop />}
    </>
  );
}
