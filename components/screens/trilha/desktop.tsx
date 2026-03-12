import { router } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import { TrilhaCardGrid } from "@/components/ui/trilha-card-grid";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";

import { TrilhaContent, trilhaCards } from "./content";
import styles from "./styles/web-styles";

type TrilhaDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};


export default function TrilhaDesktop({
  user,
  onLogout,
}: TrilhaDesktopProps) {
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "trilha",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>{TrilhaContent.title}</Text>
        <Text style={styles.description} allowFontScaling={false}>
          {TrilhaContent.previewText}
        </Text>

        <View style={styles.gridSection}>
          <TrilhaCardGrid items={trilhaCards} />
        </View>
      </ScrollView>
    </BaseWeb>
  );
}
