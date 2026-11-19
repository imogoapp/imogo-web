import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";

import { simuladorFlowContent } from "@/components/screens/simulador/flow/content";
import SimuladorFlowDesktop from "@/components/screens/simulador/flow/desktop";
import SimuladorFlowMobile from "@/components/screens/simulador/flow/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  logoutSession,
  getSessionUser,
} from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function SimuladorFlowScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
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
