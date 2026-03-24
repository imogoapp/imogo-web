import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";

import { simuladorFlowContent } from "@/components/screens/simulador/flow/content";
import SimuladorFlowDesktop from "@/components/screens/simulador/flow/desktop";
import SimuladorFlowMobile from "@/components/screens/simulador/flow/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  clearSession,
  decodeJwtPayload,
  getSession,
} from "@/services/auth";

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

export default function SimuladorFlowScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>{`${simuladorFlowContent.title} | imoGo`}</title>
        <meta name="description" content={simuladorFlowContent.description} />
      </Head>
      {isMobile ? (
        <SimuladorFlowMobile user={user} />
      ) : (
        <SimuladorFlowDesktop user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
