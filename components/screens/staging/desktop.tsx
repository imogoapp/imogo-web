import { router } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";

import { HomeStagingContent } from "./content";
import styles from "./styles/web-styles";

type HomeStagingDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};


export default function HomeStagingDesktop({
  user,
  onLogout,
}: HomeStagingDesktopProps) {
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "staging",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>{HomeStagingContent.title}</Text>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {HomeStagingContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/manual-celer');}}
              >
                <Image
                  source={require("@/assets/icons/info.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {HomeStagingContent.manual}
                  </Text>
                </View>
              </Pressable>
              {/*  */}
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/ia-home');}}
              >
                <Image
                  source={require("@/assets/icons/foto_ia.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {HomeStagingContent.ia}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/celer-botao');}}
              >
                <Image
                  source={require("@/assets/icons/whatsapp.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {HomeStagingContent.wa}
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
