import type { Href } from "expo-router";
import { router } from "expo-router";
import { type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppTheme } from "@/constants/app-theme";
import { AuthUser } from "@/services/auth";
import { BaseWebHeader } from "./base-web-header";

export type BaseWebNavigationItem = {
  id: string;
  label: string;
  route?: Href;
  icon: any;
  iconDisabled?: any;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

type BaseWebProps = {
  user: AuthUser | null;
  navigationItems?: BaseWebNavigationItem[];
  onLogout: () => void;
  showHomeButton?: boolean;
  children: ReactNode;
};

export default function BaseWeb({
  user,
  onLogout,
  showHomeButton = false,
  children,
}: BaseWebProps) {
  return (
    <View style={styles.page}>
      {/* ── Top Header Navigation (Estilo Atualizado ri digital) ── */}
      <BaseWebHeader
        user={user}
        onLogout={onLogout}
        showHomeButton={showHomeButton}
      />

      {/* ── Área Principal de Conteúdo ────────────────────────── */}
      <View style={styles.contentArea}>
        {showHomeButton && (
          <View style={styles.backRow}>
            <Pressable
              onPress={() => router.replace("/home")}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={AppTheme.colors.primary}
              />
              <Text style={styles.backText}>Voltar para o início</Text>
            </Pressable>
          </View>
        )}

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>{children}</View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
  },
  contentArea: {
    flex: 1,
    width: "100%",
  },
  backRow: {
    paddingHorizontal: 36,
    paddingTop: 16,
    maxWidth: 1440,
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  backButtonPressed: {
    backgroundColor: "#F4ECFB",
  },
  backText: {
    fontSize: 13,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.primary,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  body: {
    paddingHorizontal: 36,
    paddingVertical: 24,
    paddingBottom: 64,
  },
  contentWrapper: {
    maxWidth: 1440,
    width: "100%",
    alignSelf: "center",
  },
});
