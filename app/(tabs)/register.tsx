import Head from 'expo-router/head';

import RegisterDesktop from '@/components/screens/register/register-desktop';
import RegisterMobile from '@/components/screens/register/register-mobile';
import { useScreenType } from '@/hooks/use-screen-type';

export default function RegisterScreen() {
  const { isMobile } = useScreenType();
  const pageTitle = 'Crie sua conta na imoGo';
  const pageDescription =
    'Crie sua conta na imoGo para continuar sua jornada de vendas e captacao de clientes.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      {isMobile ? <RegisterMobile /> : <RegisterDesktop />}
    </>
  );
}
