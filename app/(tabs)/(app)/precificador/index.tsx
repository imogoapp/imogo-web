import Head from "expo-router/head";

import PrecificadorDesktop from "@/components/screens/precificador/desktop";
import PrecificadorMobile from "@/components/screens/precificador/mobile";

import { precificadorContent } from "@/components/screens/precificador/content";
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
        <title>{`${precificadorContent.title} | imoGo`}</title>
        <meta name="description" content={precificadorContent.previewText} />
      </Head>
      {isMobile ? (
        <PrecificadorMobile />
      ) : (
        <PrecificadorDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
