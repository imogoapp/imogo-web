import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppTheme } from "@/constants/app-theme";
import { AuthUser } from "@/services/auth";

export type MobileNavTab = "home" | "help" | "conta";

type MobileBottomNavProps = {
  activeTab?: MobileNavTab;
  user?: AuthUser | null;
  onLogout?: () => void;
};

type HelpItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  url?: string;
  action?: () => void;
};

type AggregateState =
  | "operational"
  | "downtime"
  | "degraded"
  | "maintenance";

type StatusConfig = {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
};

const STATUS_MAP: Record<AggregateState, StatusConfig> = {
  operational: {
    label: "Todos os serviços online",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.10)",
    textColor: "#16a34a",
  },
  downtime: {
    label: "Serviço indisponível",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.10)",
    textColor: "#dc2626",
  },
  degraded: {
    label: "Desempenho degradado",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.10)",
    textColor: "#d97706",
  },
  maintenance: {
    label: "Em manutenção",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.10)",
    textColor: "#2563eb",
  },
};

const STATUS_FALLBACK: StatusConfig = {
  label: "Sistemas Operacionais",
  color: "#22c55e",
  bgColor: "rgba(34, 197, 94, 0.10)",
  textColor: "#16a34a",
};

const HELP_ITEMS: HelpItem[] = [
  {
    id: "whatsapp",
    label: "Atendimento WhatsApp",
    icon: "logo-whatsapp",
    url: "https://wa.me/message/DUKGPWRP7JPDF1",
  },
  {
    id: "termos",
    label: "Termos de Uso",
    icon: "document-text-outline",
    url: "https://imogo.com.br/termos-de-uso",
  },
  {
    id: "privacidade",
    label: "Política de Privacidade",
    icon: "shield-checkmark-outline",
    url: "https://imogo.com.br/politica-de-privacidade",
  },
  {
    id: "contato",
    label: "Fale Conosco",
    icon: "mail-outline",
    url: "https://imogo.com.br/contato",
  },
];

export function MobileBottomNav({
  activeTab = "home",
}: MobileBottomNavProps) {
  const [helpVisible, setHelpVisible] = useState(false);
  const [statusState, setStatusState] = useState<AggregateState | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("https://status.imogo.com.br/index.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const raw = json?.data?.attributes?.aggregate_state as AggregateState;
        if (raw && raw in STATUS_MAP) {
          setStatusState(raw);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setStatusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentStatus = statusState ? STATUS_MAP[statusState] : STATUS_FALLBACK;

  const handleTabPress = (tab: MobileNavTab) => {
    if (tab === "home") {
      router.replace("/home");
    } else if (tab === "help") {
      setHelpVisible(true);
    } else if (tab === "conta") {
      router.push("/conta");
    }
  };

  const handleOpenHelpItem = (item: HelpItem) => {
    setHelpVisible(false);
    if (item.url) {
      Linking.openURL(item.url).catch(() => {});
    } else if (item.action) {
      item.action();
    }
  };

  const handleOpenStatus = () => {
    setHelpVisible(false);
    Linking.openURL("https://status.imogo.com.br").catch(() => {});
  };

  return (
    <>
      <View style={styles.dockWrapper} pointerEvents="box-none">
        <View style={styles.dockContainer}>
          {/* Item 1: Home */}
          <Pressable
            onPress={() => handleTabPress("home")}
            accessibilityRole="button"
            accessibilityLabel="Página inicial"
            style={({ pressed }) => [
              styles.tabItem,
              activeTab === "home" && styles.tabItemActive,
              pressed && styles.tabPressed,
            ]}
          >
            <Ionicons
              name={activeTab === "home" ? "home" : "home-outline"}
              size={22}
              color={activeTab === "home" ? "#FFFFFF" : "#730D83"}
            />
          </Pressable>

          {/* Item 2: Help */}
          <Pressable
            onPress={() => handleTabPress("help")}
            accessibilityRole="button"
            accessibilityLabel="Ajuda e suporte"
            style={({ pressed }) => [
              styles.tabItem,
              activeTab === "help" && styles.tabItemActive,
              pressed && styles.tabPressed,
            ]}
          >
            <Ionicons
              name={activeTab === "help" ? "help-circle" : "help-circle-outline"}
              size={24}
              color={activeTab === "help" ? "#FFFFFF" : "#730D83"}
            />
          </Pressable>

          {/* Item 3: Conta */}
          <Pressable
            onPress={() => handleTabPress("conta")}
            accessibilityRole="button"
            accessibilityLabel="Minha conta"
            style={({ pressed }) => [
              styles.tabItem,
              activeTab === "conta" && styles.tabItemActive,
              pressed && styles.tabPressed,
            ]}
          >
            <Ionicons
              name={activeTab === "conta" ? "person" : "person-outline"}
              size={22}
              color={activeTab === "conta" ? "#FFFFFF" : "#730D83"}
            />
          </Pressable>
        </View>
      </View>

      {/* Modal / Action Sheet de Ajuda */}
      <Modal
        visible={helpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setHelpVisible(false)}
        >
          <Pressable
            style={styles.sheetContainer}
            onPress={(e) => e.stopPropagation?.()}
          >
            <View style={styles.sheetIndicator} />

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Central de Ajuda</Text>
                <Text style={styles.sheetSubtitle}>
                  Como podemos ajudar você hoje?
                </Text>
              </View>
              <Pressable
                onPress={() => setHelpVisible(false)}
                hitSlop={12}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color="#6B7280" />
              </Pressable>
            </View>

            {/* Status do Sistema Card */}
            <Pressable
              onPress={handleOpenStatus}
              style={({ pressed }) => [
                styles.statusCard,
                {
                  backgroundColor: statusLoading
                    ? "#F3F4F6"
                    : currentStatus.bgColor,
                  borderColor: statusLoading
                    ? "#E5E7EB"
                    : currentStatus.color + "33",
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.statusDotWrapper}>
                <View
                  style={[
                    styles.statusDotCore,
                    {
                      backgroundColor: statusLoading
                        ? "#9CA3AF"
                        : currentStatus.color,
                    },
                  ]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.statusCardTitle,
                    {
                      color: statusLoading
                        ? "#1F2937"
                        : currentStatus.textColor,
                    },
                  ]}
                >
                  {statusLoading
                    ? "Verificando sistemas..."
                    : currentStatus.label}
                </Text>
                <Text style={styles.statusCardSub}>
                  Ver monitoramento em tempo real
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#6B7280" />
            </Pressable>

            {/* Lista de Opções de Ajuda */}
            <ScrollView
              style={styles.helpList}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              {HELP_ITEMS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleOpenHelpItem(item)}
                  style={({ pressed }) => [
                    styles.helpItemRow,
                    pressed && styles.helpItemPressed,
                  ]}
                >
                  <View style={styles.helpItemLeft}>
                    <View
                      style={[
                        styles.helpIconBadge,
                        item.id === "whatsapp" && {
                          backgroundColor: "#E7F8EE",
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={
                          item.id === "whatsapp"
                            ? "#16A34A"
                            : AppTheme.colors.primary
                        }
                      />
                    </View>
                    <Text style={styles.helpItemLabel}>{item.label}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9CA3AF"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    position: Platform.OS === "web" ? ("fixed" as any) : "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 28 : 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    pointerEvents: "box-none" as any,
  },
  dockContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(245, 245, 245, 0.80)",
    ...(Platform.OS === "web"
      ? ({
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
        } as any)
      : {}),
    borderRadius: 36,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minWidth: 230,
    maxWidth: 280,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.90)",
    gap: 14,
  },
  tabItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          outlineWidth: 0,
        } as any)
      : {}),
  },
  tabItemActive: {
    backgroundColor: "#730D83",
    shadowColor: "#730D83",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  tabPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.92 }],
  },

  /* ── Modal / Action Sheet ───────────────── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: AppTheme.typography.fontBold,
    color: "#111827",
  },
  sheetSubtitle: {
    fontSize: 13,
    fontFamily: AppTheme.typography.fontRegular,
    color: "#6B7280",
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  statusDotWrapper: {
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDotCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusCardTitle: {
    fontSize: 14,
    fontFamily: AppTheme.typography.fontBold,
  },
  statusCardSub: {
    fontSize: 12,
    fontFamily: AppTheme.typography.fontRegular,
    color: "#6B7280",
    marginTop: 2,
  },
  helpList: {
    marginBottom: 8,
  },
  helpItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  helpItemPressed: {
    backgroundColor: "#F9FAFB",
  },
  helpItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  helpIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F4ECFB",
    alignItems: "center",
    justifyContent: "center",
  },
  helpItemLabel: {
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    color: "#1F2937",
  },
});
