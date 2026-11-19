import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPrecificadorResultado } from "./state";

import PrecificadorResultadoDesktop from "@/components/screens/precificador/resultado/desktop";
import PrecificadorResultadoMobile from "@/components/screens/precificador/resultado/mobile";
import { precificadorContent } from "@/components/screens/precificador/content";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  logoutSession,
  getSessionUser,
} from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function PrecificadorResultadoScreen() {
  const { isMobile } = useScreenType();
  const [resultadoData, setResultadoData] = useState<any>(null);

  useEffect(() => {
    // Carrega o resultado da store local (em vez de params do router)
    const storeData = getPrecificadorResultado();
    if (storeData) {
      setResultadoData(storeData);
    } else {
      router.replace("/precificador");
    }
  }, []);

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  if (!resultadoData) {
    return null; // ou um loader minimalista se preferir
  }

  return (
    <>
      <Head>
        <title>{`${precificadorContent.title} - Resultado | imoGo`}</title>
        <meta name="description" content={precificadorContent.previewText} />
      </Head>
      {isMobile ? (
        <PrecificadorResultadoMobile resultado={resultadoData} />
      ) : (
        <PrecificadorResultadoDesktop
          user={user}
          onLogout={handleLogout}
          resultado={resultadoData}
        />
      )}
    </>
  );
}
