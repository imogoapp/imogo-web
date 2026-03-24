import Head from "expo-router/head";

import { precificadorContent } from "@/components/screens/precificador/flow/content";
import PrecificadorFlowDesktop from "@/components/screens/precificador/flow/desktop";
import PrecificadorFlowMobile from "@/components/screens/precificador/flow/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import {
    AuthUser,
    clearSession,
    decodeJwtPayload,
    getSession,
} from "@/services/auth";

import { router } from "expo-router";
import { useCallback, useMemo } from "react";

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

export default function PrecificadorFlowScreen() {
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
        <meta name="description" content={precificadorContent.flowIntroText} />
      </Head>
      {isMobile ? (
        <PrecificadorFlowMobile />
      ) : (
        <PrecificadorFlowDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
