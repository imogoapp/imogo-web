import Head from "expo-router/head";

import TrilhaDesktop from "@/components/screens/trilha/desktop";
import TrilhaMobile from "@/components/screens/trilha/mobile";
import { TrilhaContent } from "@/components/screens/trilha/content";
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

export default function TrilhaPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>{`${TrilhaContent.title} | imoGo`}</title>
        <meta name="description" content={TrilhaContent.previewText} />
      </Head>
      {isMobile ? (
        <TrilhaMobile />
      ) : (
        <TrilhaDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
