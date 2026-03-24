import Head from "expo-router/head";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";

import CertidoesCnpjDesktop from "@/components/screens/certidoes/flow/proprietario/cnpj/desktop";
import CertidoesCnpjMobile from "@/components/screens/certidoes/flow/proprietario/cnpj/mobile";
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

export default function CertidoesCnpjFlowScreen() {
  const { isMobile } = useScreenType();

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace("/welcome");
  }, []);

  const user = useMemo(() => decodeUserFromSession(), []);

  return (
    <>
      <Head>
        <title>Certidões CNPJ | imoGo</title>
        <meta
          name="description"
          content="Fluxo de emissao de certidoes para proprietario pessoa juridica."
        />
      </Head>
      {isMobile ? (
        <CertidoesCnpjMobile user={user} onLogout={handleLogout} />
      ) : (
        <CertidoesCnpjDesktop
          key={isMobile ? "mobile" : "desktop"}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
