import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { getHomeFeatureDefinitions } from "@/components/screens/home/home-tools";
import { AppTheme } from "@/constants/app-theme";
import { AuthUser } from "@/services/auth";

type NavPopoverType = "servicos" | "ajuda" | "status" | "user" | null;

type BaseWebHeaderProps = {
  user: AuthUser | null;
  onLogout: () => void;
  showHomeButton?: boolean;
};

type HelpItem = {
  id: string;
  label: string;
  url?: string;
  route?: Href;
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
    label: "Atendimento Online",
    url: "https://wa.me/message/DUKGPWRP7JPDF1",
  },
  {
    id: "termos",
    label: "Termos de Uso",
    url: "https://imogo.com.br/termos-de-uso",
  },
  {
    id: "privacidade",
    label: "Minha Privacidade",
    url: "https://imogo.com.br/politica-de-privacidade",
  },
  {
    id: "contato",
    label: "Contato",
    url: "https://imogo.com.br/contato",
  }
];

const FEATURE_COLORS: Record<string, string> = {
  precificador: "#F3EBF9",
  credito: "#F3EBF9",
  certidoes: "#F3EBF9",
  staging: "#F3EBF9",
  planejador: "#F3EBF9",
  trilha: "#F3EBF9",
  contratos: "#F3EBF9",
  boletos: "#F3EBF9",
  anuncios: "#F3EBF9",
};

export function BaseWebHeader({ user, onLogout }: BaseWebHeaderProps) {
  const [activePopover, setActivePopover] = useState<NavPopoverType>(null);
  const [statusState, setStatusState] = useState<AggregateState | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const { width } = useWindowDimensions();
  const hoverTimeoutRef = useRef<any>(null);

  const homeFeatures = getHomeFeatureDefinitions();
  const userPhoto = typeof user?.photo === "string" ? user.photo : "";

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

  const handleMouseEnter = (type: NavPopoverType) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActivePopover(type);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActivePopover(null);
    }, 250);
  };

  const togglePopover = (type: NavPopoverType) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActivePopover((prev) => (prev === type ? null : type));
  };

  const closePopover = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActivePopover(null);
  };

  const handleNavigate = (route?: Href) => {
    closePopover();
    if (route) {
      router.push(route as never);
    }
  };

  const handleOpenHelpItem = (item: HelpItem) => {
    closePopover();
    if (item.url) {
      Linking.openURL(item.url).catch(() => {});
    } else if (item.route) {
      router.push(item.route as never);
    } else if (item.action) {
      item.action();
    }
  };

  const handleOpenStatusExternal = () => {
    closePopover();
    Linking.openURL("https://status.imogo.com.br").catch(() => {});
  };

  const isServicosOpen = activePopover === "servicos";
  const isAjudaOpen = activePopover === "ajuda";
  const isStatusOpen = activePopover === "status";
  const isUserOpen = activePopover === "user";

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerInner}>
        {/* ── 1. Left: Logo ───────────────────────────────── */}
        <View style={styles.leftSection}>
          <Pressable
            onPress={() => router.replace("/home")}
            accessibilityLabel="Ir para página inicial"
            style={({ pressed }) => [
              styles.logoPressable,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Image
              source={require("@/assets/img/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </Pressable>
        </View>

        {/* ── 2. Center: Navigation Bar (Centralizado) ────── */}
        <View style={styles.centerSection}>
          {/* Serviços Nav Item */}
          <View
            // @ts-ignore
            onMouseEnter={() => handleMouseEnter("servicos")}
            onMouseLeave={handleMouseLeave}
            style={styles.navItemWrapper}
          >
            <Pressable
              onPress={() => togglePopover("servicos")}
              style={({ pressed }) => [
                styles.navItemButton,
                isServicosOpen && styles.navItemButtonActive,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Text
                style={[
                  styles.navItemText,
                  isServicosOpen && styles.navItemTextActive,
                ]}
              >
                Serviços
              </Text>
              <View
                style={[
                  styles.chevronWrap,
                  {
                    transform: [{ rotate: isServicosOpen ? "180deg" : "0deg" }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={isServicosOpen ? AppTheme.colors.primary : "#4B4E5D"}
                />
              </View>
            </Pressable>
          </View>

          {/* Ajuda Nav Item */}
          <View
            // @ts-ignore
            onMouseEnter={() => handleMouseEnter("ajuda")}
            onMouseLeave={handleMouseLeave}
            style={styles.navItemWrapper}
          >
            <Pressable
              onPress={() => togglePopover("ajuda")}
              style={({ pressed }) => [
                styles.navItemButton,
                isAjudaOpen && styles.navItemButtonActive,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Text
                style={[
                  styles.navItemText,
                  isAjudaOpen && styles.navItemTextActive,
                ]}
              >
                Ajuda
              </Text>
              <View
                style={[
                  styles.chevronWrap,
                  {
                    transform: [{ rotate: isAjudaOpen ? "180deg" : "0deg" }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={isAjudaOpen ? AppTheme.colors.primary : "#4B4E5D"}
                />
              </View>
            </Pressable>
          </View>

          {/* Status Nav Item */}
          <View
            // @ts-ignore
            onMouseEnter={() => handleMouseEnter("status")}
            onMouseLeave={handleMouseLeave}
            style={styles.navItemWrapper}
          >
            <Pressable
              onPress={() => togglePopover("status")}
              style={({ pressed }) => [
                styles.navItemButton,
                isStatusOpen && styles.navItemButtonActive,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Text
                style={[
                  styles.navItemText,
                  isStatusOpen && styles.navItemTextActive,
                ]}
              >
                Status
              </Text>
              <View
                style={[
                  styles.chevronWrap,
                  {
                    transform: [{ rotate: isStatusOpen ? "180deg" : "0deg" }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={isStatusOpen ? AppTheme.colors.primary : "#4B4E5D"}
                />
              </View>
            </Pressable>
          </View>
        </View>

        {/* ── 3. Right: User Profile (Estilo ri digital) ──── */}
        <View style={styles.rightSection}>
          <View
            // @ts-ignore
            onMouseEnter={() => handleMouseEnter("user")}
            onMouseLeave={handleMouseLeave}
            style={styles.navItemWrapper}
          >
            <Pressable
              onPress={() => togglePopover("user")}
              style={({ pressed }) => [
                styles.userTrigger,
                isUserOpen && styles.userTriggerActive,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Image
                source={{
                  uri: userPhoto || "https://juca.eu.org/img/icon_dafault.jpg",
                }}
                style={styles.userAvatar}
                contentFit="cover"
              />
              <Text style={styles.userGreeting}>Olá</Text>
              <View
                style={[
                  styles.chevronWrap,
                  {
                    transform: [{ rotate: isUserOpen ? "180deg" : "0deg" }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={isUserOpen ? AppTheme.colors.primary : "#4B4E5D"}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Floating Popovers (Inline, sem Modal para evitar flickering de hover) ── */}
      {activePopover !== null && (
        <>
          {/* Backdrop invisível para fechar ao clicar fora */}
          <Pressable style={styles.backdropOverlay} onPress={closePopover} />

          {/* 1. Popover Serviços (Cards em Grid com dados do Home) */}
          {isServicosOpen && (
            <View
              // @ts-ignore
              onMouseEnter={() => handleMouseEnter("servicos")}
              onMouseLeave={handleMouseLeave}
              style={[
                styles.servicosPopover,
                width < 960 && { left: 24, right: 24, width: "auto" },
              ]}
            >
              <View style={styles.servicosGrid}>
                {homeFeatures.map((feature) => {
                  const isDisabled = !!feature.disabled;
                  const badgeBg = FEATURE_COLORS[feature.id] || "#F5F5F7";
                  const iconSource = isDisabled
                    ? feature.iconDisabled ?? feature.icon
                    : feature.icon;

                  return (
                    <Pressable
                      key={feature.id}
                      disabled={isDisabled}
                      onPress={() => handleNavigate(feature.route)}
                      style={({ pressed }) => [
                        styles.servicoCard,
                        isDisabled && styles.servicoCardDisabled,
                        !isDisabled && pressed && styles.servicoCardPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.servicoIconBadge,
                          { backgroundColor: badgeBg },
                        ]}
                      >
                        <Image
                          source={iconSource}
                          style={styles.servicoIcon}
                          contentFit="contain"
                        />
                      </View>
                      <View style={styles.servicoLabelWrap}>
                        <Text
                          style={[
                            styles.servicoLabel,
                            isDisabled && styles.servicoLabelDisabled,
                          ]}
                          numberOfLines={2}
                        >
                          {feature.label}
                        </Text>
                        {isDisabled && (
                          <Text style={styles.emBreveBadge}>Em breve</Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* 2. Popover Ajuda (Lista de Links) */}
          {isAjudaOpen && (
            <View
              // @ts-ignore
              onMouseEnter={() => handleMouseEnter("ajuda")}
              onMouseLeave={handleMouseLeave}
              style={styles.ajudaPopover}
            >
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {HELP_ITEMS.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleOpenHelpItem(item)}
                    style={({ pressed }) => [
                      styles.ajudaListItem,
                      pressed && styles.ajudaListItemPressed,
                    ]}
                  >
                    <Text style={styles.ajudaItemText}>{item.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 3. Popover Status (Com link para página externa status.imogo.com.br e dados em tempo real) */}
          {isStatusOpen && (
            <View
              // @ts-ignore
              onMouseEnter={() => handleMouseEnter("status")}
              onMouseLeave={handleMouseLeave}
              style={styles.statusPopover}
            >
              <Pressable
                onPress={handleOpenStatusExternal}
                style={({ pressed }) => [
                  styles.statusLinkItem,
                  pressed && styles.ajudaListItemPressed,
                ]}
              >
                <View style={styles.statusLinkLeft}>
                  <Ionicons
                    name="speedometer-outline"
                    size={18}
                    color={AppTheme.colors.primary}
                  />
                  <Text style={styles.statusLinkText}>
                    Status do Sistema 
                  </Text>
                </View>
                <Ionicons name="open-outline" size={15} color="#8E92A2" />
              </Pressable>

              <Pressable
                onPress={handleOpenStatusExternal}
                style={({ pressed }) => [
                  styles.statusBox,
                  {
                    backgroundColor: statusLoading
                      ? "#FAFAFC"
                      : currentStatus.bgColor,
                    borderColor: statusLoading
                      ? "#EAEAEA"
                      : currentStatus.color + "33",
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={styles.statusDotWrapper}>
                  {!statusLoading && (
                    <View
                      style={[
                        styles.statusDotPing,
                        { backgroundColor: currentStatus.color },
                      ]}
                    />
                  )}
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
                      styles.statusBoxTitle,
                      {
                        color: statusLoading
                          ? "#2C2E3B"
                          : currentStatus.textColor,
                      },
                    ]}
                  >
                    {statusLoading
                      ? "Verificando status..."
                      : currentStatus.label}
                  </Text>
                  <Text style={styles.statusBoxSub}>
                    Clique para abrir status.imogo.com.br
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          {/* 4. Popover Perfil do Usuário (Estilo ri digital) */}
          {isUserOpen && (
            <View
              // @ts-ignore
              onMouseEnter={() => handleMouseEnter("user")}
              onMouseLeave={handleMouseLeave}
              style={styles.userPopover}
            >
              {/* Item 1: Minha Conta */}
              <Pressable
                onPress={() => handleNavigate("/conta")}
                style={({ pressed }) => [
                  styles.userMenuItemRow,
                  pressed && styles.userMenuItemRowPressed,
                ]}
              >
                <View style={styles.userMenuItemLeft}>
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="#484B5B"
                  />
                  <Text style={styles.userMenuItemText}>Minha conta</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8E92A2" />
              </Pressable>

              {/* Item 2: Sair */}
              <Pressable
                onPress={() => {
                  closePopover();
                  onLogout();
                }}
                style={({ pressed }) => [
                  styles.userMenuItemRow,
                  pressed && styles.userMenuItemRowPressed,
                ]}
              >
                <View style={styles.userMenuItemLeft}>
                  <Ionicons
                    name="log-out-outline"
                    size={22}
                    color="#484B5B"
                  />
                  <Text style={styles.userMenuItemText}>Sair</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8E92A2" />
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDF2",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    zIndex: 999,
    position: "relative",
  },
  headerInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 36,
    maxWidth: 1440,
    width: "100%",
    alignSelf: "center",
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logoPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 132,
    height: 38,
  },
  centerSection: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  navItemWrapper: {
    position: "relative",
    paddingVertical: 12,
  },
  navItemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemButtonActive: {
    backgroundColor: "#F4ECFB",
  },
  navItemText: {
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    color: "#2C2E3B",
  },
  navItemTextActive: {
    color: AppTheme.colors.primary,
  },
  chevronWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  userTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  userTriggerActive: {
    backgroundColor: "#F4ECFB",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E6DFEA",
  },
  userGreeting: {
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    color: "#2C2E3B",
  },
  pressedOpacity: {
    opacity: 0.8,
  },

  /* ── Backdrop & Popovers ────────────────────────────────── */
  backdropOverlay: {
    position: "fixed" as any,
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  servicosPopover: {
    position: "absolute",
    top: 66,
    alignSelf: "center",
    width: 860,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#EBEBED",
    shadowColor: "#0F111E",
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    zIndex: 1100,
  },
  servicosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
    columnGap: 16,
  },
  servicoCard: {
    width: "31.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  servicoCardPressed: {
    backgroundColor: "#F7F5FB",
  },
  servicoCardDisabled: {
    opacity: 0.45,
  },
  servicoIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  servicoIcon: {
    width: 20,
    height: 20,
  },
  servicoLabelWrap: {
    flex: 1,
  },
  servicoLabel: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: AppTheme.typography.fontBold,
    color: "#2C2E3B",
  },
  servicoLabelDisabled: {
    color: "#8E92A2",
  },
  emBreveBadge: {
    fontSize: 10,
    color: "#9A9EAF",
    marginTop: 2,
    fontFamily: AppTheme.typography.fontRegular,
  },

  /* ── Ajuda Popover (Lista vertical como no print) ───────── */
  ajudaPopover: {
    position: "absolute",
    top: 66,
    alignSelf: "center",
    marginLeft: 30,
    width: 290,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#EBEBED",
    shadowColor: "#0F111E",
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    zIndex: 1100,
  },
  ajudaListItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  ajudaListItemPressed: {
    backgroundColor: "#F7F5FB",
  },
  ajudaItemText: {
    fontSize: 14,
    color: "#2C2E3B",
    fontFamily: AppTheme.typography.fontBold,
  },

  /* ── Status Popover ────────────────────────────────────── */
  statusPopover: {
    position: "absolute",
    top: 66,
    alignSelf: "center",
    marginLeft: 140,
    width: 320,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EBEBED",
    shadowColor: "#0F111E",
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    zIndex: 1100,
  },
  statusLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusLinkText: {
    fontSize: 14,
    fontFamily: AppTheme.typography.fontBold,
    color: "#2C2E3B",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  statusDotWrapper: {
    width: 10,
    height: 10,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  statusDotPing: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.35,
  },
  statusDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBoxTitle: {
    fontSize: 13,
    fontFamily: AppTheme.typography.fontBold,
  },
  statusBoxSub: {
    fontSize: 12,
    color: "#74788B",
    marginTop: 2,
    fontFamily: AppTheme.typography.fontRegular,
  },

  /* ── User Profile Popover (Exato estilo ri digital) ───── */
  userPopover: {
    position: "absolute",
    top: 66,
    right: 36,
    width: 250,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#EBEBED",
    shadowColor: "#0F111E",
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    zIndex: 1100,
  },
  userMenuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  userMenuItemRowPressed: {
    backgroundColor: "#F7F5FB",
  },
  userMenuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userMenuItemText: {
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    color: "#2C2E3B",
  },
});
