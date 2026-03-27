import { router } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View, Linking } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";

import { PlanejadorContent } from "./content";
import styles from "./styles/web-styles";
import { useAnalytics } from "@/hooks/use-analytics";

type PlanejadorDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};


export default function PlanejadorDesktop({
  user,
  onLogout,
}: PlanejadorDesktopProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "planejador",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>{PlanejadorContent.title}</Text>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {PlanejadorContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://cdn.imogo.com.br/manuais/dando_os_primeiros_passos.pdf');}}
              >
                <Image
                  source={require("@/assets/icons/download.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {PlanejadorContent.b1}
                  </Text>
                </View>
              </Pressable>
              {/*  */}
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/cronograma-postagem');}}
              >
                <Image
                  source={require("@/assets/icons/download.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {PlanejadorContent.b2}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://www.canva.com/design/DAGdnOpmQEM/LIuZfAtKG-HtZ_u2ean2LA/view');}}
              >
                <Image
                  source={require("@/assets/icons/download.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {PlanejadorContent.b3}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.laterButton}
              onPress={() => router.replace("/home")}
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={styles.laterIcon}
                contentFit="contain"
              />
              <Text style={styles.laterButtonText} allowFontScaling={false}>
                Voltar pra home
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </BaseWeb>
  );
}
