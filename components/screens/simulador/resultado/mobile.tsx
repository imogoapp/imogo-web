import { router } from "expo-router";
import React from "react";
import { Linking, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/ui/app-button";
import { AppTheme } from "@/constants/app-theme";
import { simuladorResultadoMobileStyles as styles } from "./styles/mobile-styles";

type SimuladorResultadoMobileProps = {
  downloadLink: string;
};

export default function SimuladorResultadoMobile({
  downloadLink,
}: SimuladorResultadoMobileProps) {

  const handleDownload = async () => {
    if (Platform.OS === "web") {
      window.open(downloadLink, "_blank", "noopener,noreferrer");
    } else {
      await Linking.openURL(downloadLink);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.replace("/simulador")} style={styles.backButton}>
          <Ionicons name="close" size={24} color={AppTheme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Resultado da Simulação</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={80} color={AppTheme.colors.primary} style={styles.iconSpacing} />
            <Text style={styles.title}>Simulação Concluída!</Text>
            <Text style={styles.description}>
              Sua simulação de crédito foi gerada com sucesso. Você já pode visualizar ou baixar o PDF.
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            <AppButton
              label="Baixar Simulação (PDF)"
              onPress={handleDownload}
              fullWidth
            />

            <AppButton
              label="Voltar para o Início"
              variant="secondary"
              onPress={() => router.replace("/simulador")}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
