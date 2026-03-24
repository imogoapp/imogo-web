import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSimuladorLink } from "./state";

import SimuladorResultadoDesktop from "@/components/screens/simulador/resultado/desktop";
import SimuladorResultadoMobile from "@/components/screens/simulador/resultado/mobile";
import { simuladorFlowContent } from "@/components/screens/simulador/flow/content";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  clearSession,
  decodeJwtPayload,
  getSession,
} from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  const session = getSession();
  if (!session?.token) return null;
  const payload = decodeJwtPayload(session.token);
  if (!payload) return null;
  return payload as AuthUser;
}

export default function SimuladorResultadoScreen() {
  const { isMobile } = useScreenType();
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    const link = getSimuladorLink();
    if (link) {
      setDownloadLink(link);
    } else {
      router.replace("/simulador/flow");
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  if (!downloadLink) {
    return null; 
  }

  return (
    <>
      <Head>
        <title>{`${simuladorFlowContent.title} - Resultado | imoGo`}</title>
        <meta name="description" content={simuladorFlowContent.description} />
      </Head>
      {isMobile ? (
        <SimuladorResultadoMobile downloadLink={downloadLink} />
      ) : (
        <SimuladorResultadoDesktop user={user} onLogout={handleLogout} downloadLink={downloadLink} />
      )}
    </>
  );
}
