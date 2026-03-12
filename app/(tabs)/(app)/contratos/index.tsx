import Head from "expo-router/head";

import ContratosDesktop from "@/components/screens/contratos/desktop";
import ContratosMobile from "@/components/screens/contratos/mobile";
import { ContratosContent } from "@/components/screens/contratos/content";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  clearSession,
  decodeJwtPayload,
  getSession,
} from "@/services/auth";

import { useCallback, useMemo } from "react";
import { router } from "expo-router";

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

export default function ContratoPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    clearSession();
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
