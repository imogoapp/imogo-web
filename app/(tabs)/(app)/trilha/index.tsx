import Head from "expo-router/head";

import TrilhaDesktop from "@/components/screens/trilha/desktop";
import TrilhaMobile from "@/components/screens/trilha/mobile";
import { TrilhaContent } from "@/components/screens/trilha/content";
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

export default function TrilhaPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
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
