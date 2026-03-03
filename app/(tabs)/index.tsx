import Head from 'expo-router/head';

import { HomeDesktop } from '@/components/screens/home/home-desktop';
import { HomeMobile } from '@/components/screens/home/home-mobile';
import { usePwaInstalled } from '@/hooks/use-pwa-installed';
import { useScreenType } from '@/hooks/use-screen-type';

export default function HomeScreen() {
  const { isMobile, width } = useScreenType();
  const { isInstalled } = usePwaInstalled();

  const pageTitle = isMobile ? 'Welcome Mobile | imoGo' : 'Welcome Desktop | imoGo';
  const pageDescription = isMobile
    ? 'Versao mobile da pagina inicial do imoGo com layout otimizado para telas pequenas.'
    : 'Versao desktop da pagina inicial do imoGo com layout otimizado para telas amplas.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      {isMobile ? (
        <HomeMobile width={width} isPwaInstalled={isInstalled} />
      ) : (
        <HomeDesktop width={width} isPwaInstalled={isInstalled} />
      )}
    </>
  );
}
