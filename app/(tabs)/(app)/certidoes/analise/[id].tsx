import Head from "expo-router/head";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";

import AnaliseDetalheDesktop from "@/components/screens/certidoes/analise/desktop";
import AnaliseDetalheMobile from "@/components/screens/certidoes/analise/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  logoutSession,
  getSessionUser,
} from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function AnaliseDetalheScreen() {
  const { isMobile } = useScreenType();
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  if (!id) return null;

  return (
    <>
      <Head>
        <title>Detalhes da Solicitação | imoGo</title>
        <meta
          name="description"
          content="Detalhes da análise de certidões."
        />
      </Head>
      {isMobile ? (
        <AnaliseDetalheMobile
          user={user}
          onLogout={handleLogout}
          analiseId={id}
        />
      ) : (
        <AnaliseDetalheDesktop
          key={isMobile ? "mobile" : "desktop"}
          user={user}
          onLogout={handleLogout}
          analiseId={id}
        />
      )}
    </>
  );
}
