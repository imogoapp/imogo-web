import Head from "expo-router/head";

import CertidoesDesktop from "@/components/screens/certidoes/desktop";
import CertidoesMobile from "@/components/screens/certidoes/mobile";
import { CertidoesContent } from "@/components/screens/certidoes/content";
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

export default function CertidoesPreviewScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>{`${CertidoesContent.title} | imoGo`}</title>
        <meta name="description" content={CertidoesContent.previewText} />
      </Head>
      {isMobile ? (
        <CertidoesMobile />
      ) : (
        <CertidoesDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
