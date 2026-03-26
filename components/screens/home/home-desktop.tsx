import { router } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";

import {
  createBaseWebNavigationItems,
  getHomeFeatureDefinitions,
} from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { BaseWebFeatureCard } from "@/components/ui/base-web-feature-card";
import { AuthUser } from "@/services/auth";
import styles from "./styles/home-web-styles";

type HomeDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export default function HomeDesktop({ user, onLogout }: HomeDesktopProps) {
  const userName = typeof user?.name === "string" ? user.name : "Usuário";
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: undefined,
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );
  const features = useMemo(() => getHomeFeatureDefinitions(), []);

  return (
    <BaseWeb
      user={user}
      navigationItems={navigationItems}
      onLogout={onLogout}
      showHomeButton={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.welcomeMinimal}>Bem-vindo(a), {userName} 👋</Text>
        <Text style={styles.desktopDescription}>
          Transforme sua rotina com as ferramentas inteligentes da imoGo para
          crescer no mercado imobiliário.
        </Text>
      </View>

      <View style={styles.desktopGrid}>
        {features.map((feature) => (
          <View key={feature.id} style={styles.desktopGridItem}>
            <BaseWebFeatureCard
              title={feature.label}
              description={feature.description}
              icon={
                feature.disabled
                  ? (feature.iconDisabled ?? feature.icon)
                  : feature.icon
              }
              accentColor={feature.accentColor}
              disabled={feature.disabled}
              onPress={
                feature.route
                  ? () => router.push(feature.route as never)
                  : undefined
              }
            />
          </View>
        ))}
      </View>
    </BaseWeb>
  );
}
