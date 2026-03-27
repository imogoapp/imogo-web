import { router } from "expo-router";
import React, { useMemo } from "react";
import { Platform, Text, Linking, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { BaseWebButton } from "@/components/ui/base-web-button";
import { AuthUser } from "@/services/auth";
import { AppTheme } from "@/constants/app-theme";
import { useAnalytics } from "@/hooks/use-analytics";

import { simuladorResultadoWebStyles as styles } from "./styles/web-styles";

type SimuladorResultadoDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
  downloadLink: string;
};

export default function SimuladorResultadoDesktop({
  user,
  onLogout,
  downloadLink,
}: SimuladorResultadoDesktopProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();

  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "credito",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  const handleDownload = async () => {
    if (Platform.OS === "web") {
      window.open(downloadLink, "_blank", "noopener,noreferrer");
    } else {
      await Linking.openURL(downloadLink);
    }
  };

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <View style={styles.contentMinimal as any}>
        <View style={styles.formContainer as any}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={80} color={AppTheme.colors.primary} style={styles.iconSpacing as any} />
            <Text style={styles.title as any}>Simulação Concluída!</Text>
            <Text style={styles.description as any}>
              Sua simulação de crédito foi gerada com sucesso. Você já pode visualizar ou baixar o PDF.
            </Text>
          </View>

          <View style={styles.actionsContainer as any}>
            <BaseWebButton
              label="Baixar Simulação (PDF)"
              onPress={handleDownload}
              contentStyle={{ width: "100%" }}
            />

            <BaseWebButton
              label="Voltar para o Início"
              variant="secondary"
              onPress={() => router.replace("/simulador")}
              contentStyle={{ width: "100%" } as any}
            />
          </View>
        </View>
      </View>
    </BaseWeb>
  );
}
