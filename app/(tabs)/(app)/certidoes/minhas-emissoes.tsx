import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";

import MinhasEmissoesDesktop from "@/components/screens/certidoes/minhas-emissoes/desktop";
import MinhasEmissoesMobile from "@/components/screens/certidoes/minhas-emissoes/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  logoutSession,
  getSessionUser,
} from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function MinhasEmissoesScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>Minhas Emissões | imoGo</title>
        <meta
          name="description"
          content="Lista de emissões de certidões solicitadas."
        />
      </Head>
      {isMobile ? (
        <MinhasEmissoesMobile user={user} onLogout={handleLogout} />
      ) : (
        <MinhasEmissoesDesktop
          key={isMobile ? "mobile" : "desktop"}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

