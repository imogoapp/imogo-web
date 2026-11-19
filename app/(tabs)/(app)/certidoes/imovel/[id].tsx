import Head from "expo-router/head";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";

import CertidoesImovelDesktop from "@/components/screens/certidoes/flow/imovel/desktop";
import CertidoesImovelMobile from "@/components/screens/certidoes/flow/imovel/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import { AuthUser, logoutSession, getSessionUser } from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function CertidoesImovelFlowScreen() {
  const { isMobile } = useScreenType();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const analiseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  if (!analiseId) {
    router.replace("/certidoes");
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Dados do imovel | imoGo`}</title>
        <meta
          name="description"
          content="Etapa de dados do imovel para emissao de certidoes."
        />
      </Head>
      {isMobile ? (
        <CertidoesImovelMobile
          user={user}
          onLogout={handleLogout}
          analiseId={analiseId}
        />
      ) : (
        <CertidoesImovelDesktop
          user={user}
          onLogout={handleLogout}
          analiseId={analiseId}
        />
      )}
    </>
  );
}
