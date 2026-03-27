import { Image } from "expo-image";
import { router, type Href } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useWindowDimensions,
} from "react-native";

import { HomeSideMenu } from "@/components/screens/home/components/home-side-menu";
import {
  HomeToolItem,
  HomeToolsGrid,
} from "@/components/screens/home/components/home-tools-grid";
import { createHomeToolItems } from "@/components/screens/home/home-tools";
import {
  AuthUser,
  clearSession,
  decodeJwtPayload,
  getSession,
} from "@/services/auth";
import { createHomeMobileStyles } from "./styles/home-mobile-styles";
import { useAnalytics } from "@/hooks/use-analytics";

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

type HomeMobileProps = {
  onLogout: () => void;
};

export default function HomeMobile({ onLogout }: HomeMobileProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();
  const { width, height } = useWindowDimensions();
  const styles = useMemo(
    () => createHomeMobileStyles({ width, height }),
    [height, width],
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const payloadUser = decodeUserFromSession();
    if (!payloadUser) {
      clearSession();
      onLogout();
      return;
    }

    setUser(payloadUser);
  }, [onLogout]);

  const handleMenuClose = useCallback(() => setMenuVisible(false), []);
  const handleMenuOpen = useCallback(() => setMenuVisible(true), []);

  const handleLogout = useCallback(() => {
    clearSession();
    setMenuVisible(false);
    onLogout();
  }, [onLogout]);

  const userName = typeof user?.name === "string" ? user.name : "Usuario";
  const userEmail = typeof user?.email === "string" ? user.email : "";
  const userPhoto = typeof user?.photo === "string" ? user.photo : "";

  const handleNavigate = useCallback((path: Href) => {
    router.push(path);
  }, []);

  const tools = useMemo<HomeToolItem[]>(
    () => createHomeToolItems({ onNavigate: handleNavigate }),
    [handleNavigate],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={styles.headerContainer}>
        <Pressable onPress={handleMenuOpen} style={styles.menuButton}>
          <Image
            source={require("@/assets/icons/menu.png")}
            style={styles.menuIcon}
            contentFit="contain"
          />
        </Pressable>
        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/img/logo.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

      <View style={styles.headerDivider} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeToolsGrid items={tools} />
      </ScrollView>

      <HomeSideMenu
        visible={menuVisible}
        onClose={handleMenuClose}
        onLogout={handleLogout}
        userName={userName}
        userEmail={userEmail}
        userPhoto={userPhoto}
      />

    </SafeAreaView>
  );
}
