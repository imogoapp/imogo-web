import Head from "expo-router/head";

import SimuladorDesktop from "@/components/screens/simulador/simulador-desktop";
import SimuladorMobile from "@/components/screens/simulador/simulador-mobile";
import { simuladorContent } from "@/components/screens/simulador/simulador-content";
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

export default function SimuladorPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>{`${simuladorContent.title} | imoGo`}</title>
        <meta name="description" content={simuladorContent.previewText} />
      </Head>
      {isMobile ? (
        <SimuladorMobile />
      ) : (
        <SimuladorDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
