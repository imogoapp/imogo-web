import Head from "expo-router/head";

import PlanejadorDesktop from "@/components/screens/planejador/desktop";
import PlanejadorMobile from "@/components/screens/planejador/mobile";
import { PlanejadorContent } from "@/components/screens/planejador/content";
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
        <title>{`${PlanejadorContent.title} | imoGo`}</title>
        <meta name="description" content={PlanejadorContent.previewText} />
      </Head>
      {isMobile ? (
        <PlanejadorMobile />
      ) : (
        <PlanejadorDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
