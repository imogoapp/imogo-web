import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { AppTheme } from "@/constants/app-theme";
import { AuthUser } from "@/services/auth";

import { BaseWebUserMenu } from "./base-web-user-menu";

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
  navigationItems: BaseWebNavigationItem[];
  onLogout: () => void;
  showHomeButton?: boolean;
  children: ReactNode;
};

export default function BaseWeb({
  user,
  navigationItems,
  onLogout,
  showHomeButton = true,
  children,
}: BaseWebProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { height } = useWindowDimensions();
  const userName = typeof user?.name === "string" ? user.name : "Corretor";
  const userEmail =
    typeof user?.email === "string" ? user.email : "Email indisponivel";
  const userPhoto = typeof user?.photo === "string" ? user.photo : "";
  const compactNav = navigationItems.length >= 8 || height < 860;
  const hideLabels = navigationItems.length >= 9 || height < 760;

  return (
    <View style={styles.page}>
      <View
        style={[styles.sidebar, hideLabels ? styles.sidebarCompact : undefined]}
      >
        <Image
          source={require("@/assets/img/go_logo.png")}
          style={[styles.logo, compactNav ? styles.logoCompact : undefined]}
          contentFit="contain"
        />

        <ScrollView
          style={styles.navScroll}
          contentContainerStyle={styles.navList}
          showsVerticalScrollIndicator={false}
        >
          {navigationItems.map((item) => {
            const disabled = !!item.disabled;
            const iconSource = disabled
              ? (item.iconDisabled ?? item.icon)
              : item.icon;

            return (
              <View key={item.id} style={styles.navItemWrap}>
                <Pressable
                  disabled={disabled}
                  onPress={item.onPress}
                  accessibilityLabel={item.label}
                  style={({ pressed }) => [
                    styles.navButton,
                    compactNav ? styles.navButtonCompact : undefined,
                    hideLabels ? styles.navButtonIconOnly : undefined,
                    item.active ? styles.navButtonActive : undefined,
                    disabled ? styles.navButtonDisabled : undefined,
                    !disabled && pressed ? styles.navButtonPressed : undefined,
                  ]}
                >
                  <Image
                    source={iconSource}
                    style={[
                      styles.navIcon,
                      compactNav ? styles.navIconCompact : undefined,
                    ]}
                    contentFit="contain"
                  />
                  {!hideLabels ? (
                    <Text
                      style={[
                        styles.navLabel,
                        item.active ? styles.navLabelActive : undefined,
                      ]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                  ) : null}
                </Pressable>
                <View style={styles.navHr} />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <Pressable
            onPress={onLogout}
            accessibilityLabel="Sair"
            style={({ pressed }) => [
              styles.logoutButton,
              hideLabels ? styles.logoutButtonCompact : undefined,
              pressed ? styles.navButtonPressed : undefined,
            ]}
          >
            <Image
              source={require("@/assets/icons/sair_roxo.png")}
              style={[
                styles.logoutIcon,
                compactNav ? styles.navIconCompact : undefined,
              ]}
              contentFit="contain"
            />
            {!hideLabels ? <Text style={styles.logoutLabel}>Sair</Text> : null}
          </Pressable>
        </View>
      </View>

      <View style={styles.contentArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {showHomeButton ? (
              <Pressable
                onPress={() => router.replace("/home")}
                accessibilityLabel="Voltar para home"
                style={({ pressed }) => [
                  styles.backButton,
                  pressed ? styles.backButtonPressed : undefined,
                ]}
              >
                <Image
                  source={require("@/assets/icons/home.png")}
                  style={styles.backIcon}
                  contentFit="contain"
                />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.userTrigger}
          >
            <Image
              source={{
                uri: userPhoto || "https://juca.eu.org/img/icon_dafault.jpg",
              }}
              style={styles.userAvatar}
              contentFit="cover"
            />
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
            <Ionicons
              name="chevron-down"
              size={18}
              color={AppTheme.colors.primary}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>

      <BaseWebUserMenu
        visible={menuVisible}
        userName={userName}
        userEmail={userEmail}
        userPhoto={userPhoto}
        onClose={() => setMenuVisible(false)}
        onLogout={onLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    width: 146,
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderRightColor: "#E6DFEA",
    paddingHorizontal: 14,
    paddingVertical: 24,
    alignItems: "center",
  },
  sidebarCompact: {
    width: 104,
    paddingHorizontal: 10,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 22,
  },
  logoCompact: {
    width: 52,
    height: 52,
  },
  navScroll: {
    flex: 1,
    width: "100%",
  },
  navList: {
    width: "100%",
    gap: 10,
    paddingBottom: 12,
  },
  navItemWrap: {
    width: "100%",
  },
  navButton: {
    minHeight: 86,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "transparent",
  },
  navButtonCompact: {
    minHeight: 72,
    borderRadius: 20,
    paddingVertical: 12,
  },
  navButtonIconOnly: {
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: "#F2E6F6",
    borderColor: "#D8B8E1",
  },
  navButtonDisabled: {
    opacity: 0.42,
  },
  navButtonPressed: {
    opacity: 0.92,
  },
  navIcon: {
    width: 28,
    height: 28,
  },
  navIconCompact: {
    width: 24,
    height: 24,
  },
  navLabel: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
    color: "#666978",
    fontFamily: AppTheme.typography.fontBold,
  },
  navLabelActive: {
    color: AppTheme.colors.primary,
  },
  navHr: {
    height: 1,
    backgroundColor: "#E6DFEA",
    marginTop: 10,
  },
  sidebarFooter: {
    width: "100%",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E6DFEA",
    marginTop: 8,
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F2E6F6",
    borderWidth: 1,
    borderColor: "#D8B8E1",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logoutButtonCompact: {
    minHeight: 48,
    borderRadius: 16,
  },
  logoutIcon: {
    width: 22,
    height: 22,
  },
  logoutLabel: {
    color: AppTheme.colors.primary,
    fontSize: 12,
    fontFamily: AppTheme.typography.fontBold,
  },
  contentArea: {
    flex: 1,
  },
  header: {
    height: 92,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#E6DFEA",
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  backButtonPressed: {
    backgroundColor: "#F2E6F6",
  },
  backIcon: {
    width: 28,
    height: 28,
  },
  userTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6DFEA",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
  },
  userMeta: {
    maxWidth: 220,
  },
  userName: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
  },
  userEmail: {
    color: "#6A6D78",
    fontSize: 12,
    fontFamily: AppTheme.typography.fontRegular,
  },
  body: {
    paddingHorizontal: 32,
    paddingVertical: 28,
  },
});
