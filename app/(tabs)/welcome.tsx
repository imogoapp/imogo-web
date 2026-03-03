import Head from 'expo-router/head';

import WelcomeDesktop from '@/components/screens/welcome/welcome-desktop';
import WelcomeMobile from '@/components/screens/welcome/welcome-mobile';
import { useScreenType } from '@/hooks/use-screen-type';

export default function WelcomeScreen() {
  const { isMobile } = useScreenType();

  const pageTitle = 'Bem vindo a imoGo';
  const pageDescription = 'Bem vindo a imoGo negocie imóveis com menos esforço. a IA faz o trabalho pesado, você colhe os  resultados.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />

      </Head>

      {isMobile ? <WelcomeMobile /> : <WelcomeDesktop />}
    </>
  );
}
