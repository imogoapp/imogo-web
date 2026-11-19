import Head from "expo-router/head";

import HomeStagingDesktop from "@/components/screens/staging/desktop";
import HomeStagingMobile from "@/components/screens/staging/mobile";
import { HomeStagingContent } from "@/components/screens/staging/content";
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

export default function HomeStagingPreviewScreen() {
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
        <title>{`${HomeStagingContent.title} | imoGo`}</title>
        <meta name="description" content={HomeStagingContent.previewText} />
      </Head>
      {isMobile ? (
        <HomeStagingMobile />
      ) : (
        <HomeStagingDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
