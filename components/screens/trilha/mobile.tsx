import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { TrilhaCardGrid } from "@/components/ui/trilha-card-grid";

import { TrilhaContent, trilhaCards } from "./content";
import { createTrilhaPreviewMobileStyles } from "./styles/preview-mobile-styles";

export default function TrilhaMobile() {
  const styles = createTrilhaPreviewMobileStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.replace("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          {TrilhaContent.title}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.description}>
            {TrilhaContent.previewText}
          </Text>
          <TrilhaCardGrid items={trilhaCards} maxWidth={420} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
