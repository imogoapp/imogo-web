import Head from "expo-router/head";

import ContratosDesktop from "@/components/screens/contratos/desktop";
import ContratosMobile from "@/components/screens/contratos/mobile";
import { ContratosContent } from "@/components/screens/contratos/content";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  logoutSession,
  getSessionUser,
} from "@/services/auth";

import { useCallback, useMemo } from "react";
import { router } from "expo-router";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function ContratoPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);
3
  return (
    <>
      <Head>
        <title>{`${ContratosContent.title} | imoGo`}</title>
        <meta name="description" content={ContratosContent.previewText} />
      </Head>
      {isMobile ? (
        <ContratosMobile />
      ) : (
        <ContratosDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
