import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";

import CertidoesCpfDesktop from "@/components/screens/certidoes/flow/proprietario/cpf/desktop";
import CertidoesCpfMobile from "@/components/screens/certidoes/flow/proprietario/cpf/mobile";
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

export default function CertidoesCpfFlowScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    clearSession();
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
