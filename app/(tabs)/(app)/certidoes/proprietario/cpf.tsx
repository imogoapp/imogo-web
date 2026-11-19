import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";

import CertidoesCpfDesktop from "@/components/screens/certidoes/flow/proprietario/cpf/desktop";
import CertidoesCpfMobile from "@/components/screens/certidoes/flow/proprietario/cpf/mobile";
import { useScreenType } from "@/hooks/use-screen-type";
import {
  AuthUser,
  logoutSession,
  getSessionUser,
} from "@/services/auth";

function decodeUserFromSession(): AuthUser | null {
  return getSessionUser();
}

export default function CertidoesCpfFlowScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    void logoutSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>Certidões CPF | imoGo</title>
        <meta
          name="description"
          content="Fluxo de emissao de certidoes para proprietario pessoa fisica."
        />
      </Head>
      {isMobile ? (
        <CertidoesCpfMobile user={user} onLogout={handleLogout} />
      ) : (
        <CertidoesCpfDesktop
          key={isMobile ? "mobile" : "desktop"}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
