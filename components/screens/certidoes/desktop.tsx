import { router } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";

import { CertidoesContent } from "./content";
import styles from "./styles/web-styles";

type CertidoesDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};


export default function CertidoesDesktop({
  user,
  onLogout,
}: CertidoesDesktopProps) {
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "certidoes",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>{CertidoesContent.title}</Text>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {CertidoesContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => router.push("/modal")}
              >
                <Image
                  source={require("@/assets/icons/files.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {CertidoesContent.previewActionLabel}
                  </Text>
                </View>
              </Pressable>
              {/*  */}
              <Pressable
                style={styles.optionButton}
                onPress={() => router.push("/modal")}
              >
                <Image
                  source={require("@/assets/icons/avaliador-roxo.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {CertidoesContent.previewActionLabelTwo}
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
