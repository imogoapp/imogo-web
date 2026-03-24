import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { simuladorContent } from "./simulador-content";
import { createPrecificadorPreviewMobileStyles } from "./styles/simulador-preview-mobile-styles";

export default function SimuladorMobile() {
  const styles = createPrecificadorPreviewMobileStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          {simuladorContent.title}
        </Text>
      </View>

      <Text allowFontScaling={false} style={styles.classificacaoText}>
        {" "}
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {simuladorContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                onPress={() => router.push("/simulador/flow")}
                style={styles.optionButton}
              >
                <Image
                  source={require("@/assets/icons/files.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text allowFontScaling={false} style={styles.optionTextTitle}>
                    {simuladorContent.previewActionLabel}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => router.replace("/home")}
              style={styles.laterButton}
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={styles.laterIcon}
                contentFit="contain"
              />
              <Text allowFontScaling={false} style={styles.laterButtonText}>
                Voltar pra home
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
