import Head from "expo-router/head";

import PrecificadorDesktop from "@/components/screens/precificador/desktop";
import PrecificadorMobile from "@/components/screens/precificador/mobile";

import { precificadorContent } from "@/components/screens/precificador/content";
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

export default function PrecificadorPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
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
