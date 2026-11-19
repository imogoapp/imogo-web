import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";

import { simuladorContent } from "./simulador-content";
import styles from "./styles/simulador-web-styles";

type SimuladorDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export default function SimuladorDesktop({
  user,
  onLogout,
}: SimuladorDesktopProps) {
  
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "credito",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>{simuladorContent.title}</Text>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {simuladorContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => router.push("/simulador/flow")}
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
                    {simuladorContent.previewActionLabel}
                  </Text>
                </View>
              </Pressable>

              {simuladorContent.externalSimulators.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.optionButton}
                  onPress={() => void Linking.openURL(item.url)}
                >
                  <Ionicons
                    name="business-outline"
                    size={22}
                    color="#730d83"
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={styles.optionTextTitle}
                      allowFontScaling={false}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color="#9B9DA6" />
                </Pressable>
              ))}
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
